import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Lazy init
let stripeInstance: Stripe;

function getStripe() {
    if (!stripeInstance) {
        if (!process.env.STRIPE_SECRET_KEY) {
            throw new Error("STRIPE_SECRET_KEY is missing");
        }
        stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
            apiVersion: '2026-01-28.clover', // Use latest or matching version
        });
    }
    return stripeInstance;
}

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Supabase Admin Client for Webhooks (Service Role)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get('stripe-signature')!;

    let event: Stripe.Event;

    try {
        const stripe = getStripe();
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
        console.error(`❌ Error message: ${err.message}`);
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;
    const subscription = event.data.object as Stripe.Subscription;

    try {
        switch (event.type) {
            // 1. CHECKOUT COMPLETED (One-time or Sub start)
            case 'checkout.session.completed':
                await handleCheckoutSessionCompleted(session);
                break;

            // 2. SUBSCRIPTION UPDATED / DELETED
            case 'customer.subscription.created':
            case 'customer.subscription.updated':
            case 'customer.subscription.deleted':
                await handleSubscriptionChange(subscription);
                break;

            default:
                console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
        }
    } catch (error) {
        console.error('Error handling webhook:', error);
        return new NextResponse('Webhook handler failed', { status: 500 });
    }

    return new NextResponse(null, { status: 200 });
}

// HANDLERS

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    const userId = session.client_reference_id;
    const priceId = session.line_items?.data[0]?.price?.id; // Simplified

    // If it's a one-time payment (mode='payment')
    if (session.mode === 'payment' && userId) {
        // metadata usually holds the product_id from our DB
        const productId = session.metadata?.product_id;

        if (productId) {
            await supabaseAdmin.from('purchases').insert({
                user_id: userId,
                product_id: productId,
                status: 'paid',
                provider_payment_id: session.payment_intent as string,
                space: session.metadata?.space || 'adults'
            });
        }
    }

    // If mode='subscription', the subscription events will handle the DB sync,
    // BUT we MUST update the role immediately so the user has access instantly.
    if (session.customer && userId) {
        const updateData: any = { stripe_customer_id: session.customer as string };
        const space = session.metadata?.space;

        if (space === 'kids') {
            updateData.access_level = 'kid';
            // Optionally ensure role is not admin to avoid downgrading admins
            // But usually we just set access_level. 
            // Existing logic: profile.role defaults to 'adult' maybe? 
            // We should be careful. Ideally 'kid' is orthogonal or we set role='user'.
            // Let's stick to strict `access_level` for now as middleware uses it.
        } else if (space === 'adults') {
            updateData.role = 'adult'; // Grant adult role
            updateData.access_level = 'adult';
        }

        await supabaseAdmin
            .from('profiles')
            .update(updateData)
            .eq('id', userId);
    }
}

async function handleSubscriptionChange(sub: Stripe.Subscription) {
    const customerId = sub.customer as string;

    // Find user by stripe_customer_id
    const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('id, role, access_level')
        .eq('stripe_customer_id', customerId)
        .single();

    if (!profile) {
        console.error('No user found for Stripe Customer:', customerId);
        return;
    }

    // Upsert Subscription
    const subscriptionData = {
        id: sub.id,
        user_id: profile.id,
        status: sub.status,
        price_id: sub.items.data[0].price.id,
        quantity: sub.items.data[0].quantity,
        cancel_at_period_end: sub.cancel_at_period_end,
        current_period_start: new Date((sub as any).current_period_start * 1000).toISOString(),
        current_period_end: new Date((sub as any).current_period_end * 1000).toISOString(),
        metadata: sub.metadata
    };

    const { error } = await supabaseAdmin
        .from('subscriptions')
        .upsert(subscriptionData);

    if (error) throw error;

    // Update Profile Status & Role Persistence
    // If subscription is active/trialing, ensure they have the role.
    // Use metadata from subscription if available (populated by our new checkout code).
    const isActive = ['active', 'trialing'].includes(sub.status);
    const space = sub.metadata?.space;

    const profileUpdate: any = { subscription_status: sub.status };

    if (isActive && space) {
        if (space === 'kids') profileUpdate.access_level = 'kid';
        if (space === 'adults') {
            profileUpdate.role = 'adult';
            profileUpdate.access_level = 'adult';
        }
    }
    // If not active (canceled/past_due), strictly speaking we might want to panic revoke?
    // But usually we let access linger until period end. 
    // Stripe status 'canceled' implies immediate? No, 'canceled' usually means deleted.
    // 'past_due' might retry. 
    // Let's rely on middleware checking 'subscription_status' ideally, but currently middleware checks role.
    // For now, we GRANT on active. We don't auto-REVOKE here to avoid accidental lockouts on payment retry.
    // A separate sync job is safer for revocations.

    await supabaseAdmin
        .from('profiles')
        .update(profileUpdate)
        .eq('id', profile.id);
}
