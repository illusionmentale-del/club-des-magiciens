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
            apiVersion: '2026-01-28.clover',
        });
    }
    return stripeInstance;
}

export async function POST(req: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const { priceId, productId, isSubscription, space } = await req.json();

    try {
        // 1. Get or Create Stripe Customer
        const { data: profile } = await supabase
            .from('profiles')
            .select('stripe_customer_id, email')
            .eq('id', user.id)
            .single();

        let customerId = profile?.stripe_customer_id;

        if (!customerId) {
            const stripe = getStripe();
            const customer = await stripe.customers.create({
                email: user.email || profile?.email,
                metadata: {
                    supabase_user_id: user.id
                }
            });
            customerId = customer.id;

            // Save it
            await supabase.from('profiles').update({ stripe_customer_id: customerId }).eq('id', user.id);
        }

        // 2. Create Session
        const stripe = getStripe();
        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: isSubscription ? 'subscription' : 'payment',
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/${space === 'kids' ? 'kids' : 'dashboard'}?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/${space === 'kids' ? 'kids' : 'dashboard'}?canceled=true`,
            client_reference_id: user.id,
            metadata: {
                product_id: productId, // Internal Product ID
                space: space,
                user_id: user.id
            },
            allow_promotion_codes: true,
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error('Stripe Checkout Error:', error);
        return new NextResponse(error.message, { status: 500 });
    }
}
