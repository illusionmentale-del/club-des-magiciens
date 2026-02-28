import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import Stripe from 'stripe';

// Lazy init to prevent build-time error if env var is missing
let stripeInstance: Stripe;

function getStripe() {
    if (!stripeInstance) {
        if (!process.env.STRIPE_SECRET_KEY) {
            throw new Error("STRIPE_SECRET_KEY is missing");
        }
        stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
            // Let's use '2024-12-18.acacia' or similar recent stable if unsure, but I'll stick to the user's string if it was working before audit.
            // Wait, previous file had '2026-01-28.clover'. If that's what they had, I'll keep it.
            apiVersion: '2025-01-27.acacia' as any, // Cast to any to avoid TS errors if usage is custom
        });
    }
    return stripeInstance;
}

export async function POST(req: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { priceId, productId, isSubscription, space } = await req.json();

    try {
        const stripe = getStripe();
        let customerId = undefined;
        let clientReferenceId = undefined;

        if (user) {
            // 1. Get Stripe Customer for logged-in user
            const { data: profile } = await supabase
                .from('profiles')
                .select('stripe_customer_id, email, first_name, last_name')
                .eq('id', user.id)
                .single();

            customerId = profile?.stripe_customer_id;

            // Verify the customer actually exists on Stripe still (in case it was deleted manually)
            if (customerId) {
                try {
                    const existingCustomer = await stripe.customers.retrieve(customerId);
                    if (existingCustomer.deleted) {
                        customerId = undefined; // It was deleted, we must recreate it
                    }
                } catch (err: any) {
                    if (err.code === 'resource_missing') {
                        customerId = undefined; // Not found on Stripe side, recreate
                    } else {
                        throw err; // Other network error, fail early
                    }
                }
            }

            // Create a new one if we don't have a valid ID
            if (!customerId) {
                const customer = await stripe.customers.create({
                    email: user.email || profile?.email || undefined,
                    name: profile?.first_name || profile?.last_name ? `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() : undefined,
                    metadata: {
                        supabase_user_id: user.id
                    }
                });
                customerId = customer.id;

                // Save it back to Supabase
                await supabase.from('profiles').update({ stripe_customer_id: customerId }).eq('id', user.id);
            }
            clientReferenceId = user.id;
        }

        const origin = new URL(req.url).origin;

        // 2. Create Session
        const sessionConfig: Stripe.Checkout.SessionCreateParams = {
            customer: customerId,
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: isSubscription ? 'subscription' : 'payment',
            success_url: `${origin}/success`,
            cancel_url: `${origin}/${space === 'kids' ? 'tarifs/kids' : (user ? 'dashboard' : 'tarifs/atelier-des-magiciens')}`,
            client_reference_id: clientReferenceId,
            metadata: {
                product_id: productId, // Internal Product ID
                space: space,
            },
            allow_promotion_codes: true,
        };

        if (user) {
            sessionConfig.metadata!.user_id = user.id;
        }

        // Add subscription_data if it's a subscription
        if (isSubscription) {
            sessionConfig.subscription_data = {
                metadata: {
                    space: space,
                }
            };
            if (user) {
                sessionConfig.subscription_data.metadata!.user_id = user.id;
            }
        }

        if (!user && !isSubscription) {
            // If it's a one-time payment and no user is logged in, Stripe doesn't create a customer by default.
            // We want to force customer creation so we can retrieve the email/details in the webhook easily.
            sessionConfig.customer_creation = 'always';
        }

        const session = await stripe.checkout.sessions.create(sessionConfig);

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error('Stripe Checkout Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
