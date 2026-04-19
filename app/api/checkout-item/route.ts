import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import Stripe from 'stripe';

let stripeInstance: Stripe;

function getStripe() {
    if (!stripeInstance) {
        if (!process.env.STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY is missing");
        stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
            apiVersion: '2025-01-27.acacia' as any,
        });
    }
    return stripeInstance;
}

export async function POST(req: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { itemId, space } = await req.json();

    if (!itemId) {
        return NextResponse.json({ error: "Missing itemId" }, { status: 400 });
    }

    try {
        // Fetch library item and verify it has a secure stripe price id
        const { data: item, error: itemError } = await supabase
            .from('library_items')
            .select('stripe_price_id, title')
            .eq('id', itemId)
            .single();

        if (itemError || !item) {
            return NextResponse.json({ error: "Item not found" }, { status: 404 });
        }

        if (!item.stripe_price_id) {
            return NextResponse.json({ error: "Item is not configured for direct purchase (Missing Price ID)" }, { status: 400 });
        }

        const stripe = getStripe();
        let customerId = undefined;
        let clientReferenceId = undefined;

        if (user) {
            const { data: profile } = await supabase.from('profiles').select('stripe_customer_id, email, first_name, last_name').eq('id', user.id).single();
            customerId = profile?.stripe_customer_id;

            if (customerId) {
                try {
                    const existingCustomer = await stripe.customers.retrieve(customerId);
                    if (existingCustomer.deleted) customerId = undefined;
                } catch (err: any) {
                    if (err.code === 'resource_missing') customerId = undefined;
                    else throw err;
                }
            }

            if (!customerId) {
                const customer = await stripe.customers.create({
                    email: user.email || profile?.email || undefined,
                    name: profile?.first_name || profile?.last_name ? `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() : undefined,
                    metadata: { supabase_user_id: user.id }
                });
                customerId = customer.id;
                await supabase.from('profiles').update({ stripe_customer_id: customerId }).eq('id', user.id);
            }
            clientReferenceId = user.id;
        }

        const origin = new URL(req.url).origin;

        const sessionConfig: Stripe.Checkout.SessionCreateParams = {
            customer: customerId,
            line_items: [{ price: item.stripe_price_id, quantity: 1 }],
            mode: 'payment',
            success_url: `${origin}/success`,
            cancel_url: `${origin}/${space === 'kids' ? 'kids/shop' : 'adults/library'}`,
            client_reference_id: clientReferenceId, // Only contains the User ID now, safe!
            metadata: {
                library_item_id: itemId, // Injected by server securely!
                space: space || 'adults',
            },
            allow_promotion_codes: true,
        };

        if (user) sessionConfig.metadata!.user_id = user.id;
        if (!user) sessionConfig.customer_creation = 'always';

        const session = await stripe.checkout.sessions.create(sessionConfig);
        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error('Stripe Checkout Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
