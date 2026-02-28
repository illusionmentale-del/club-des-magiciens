import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2024-12-18.acacia' as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
    try {
        const body = await req.text();
        const signature = req.headers.get('stripe-signature');

        if (!signature || !webhookSecret) {
            console.error("Missing Stripe signature or Webhook Secret.");
            // To allow testing without a webhook secret easily in dev:
            // return NextResponse.json({ error: 'Missing configuration' }, { status: 400 });
        }

        let event: Stripe.Event;

        try {
            if (webhookSecret) {
                event = stripe.webhooks.constructEvent(body, signature!, webhookSecret);
            } else {
                // Warning: Unverified webhook (Fallback for local dev if secret not set)
                event = JSON.parse(body);
            }
        } catch (err: any) {
            console.error(`Webhook signature verification failed: ${err.message}`);
            return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
        }

        console.log(`[Stripe Webhook] Received event: ${event.type}`);

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session;

            let userId = session.metadata?.user_id;
            let libraryItemId = session.metadata?.library_item_id;

            // Handle Payment Links which pass combined info in client_reference_id
            if (session.client_reference_id) {
                if (session.client_reference_id.includes('___')) {
                    const parts = session.client_reference_id.split('___');
                    userId = userId || parts[0];
                    libraryItemId = libraryItemId || parts[1];
                } else {
                    userId = userId || session.client_reference_id;
                }
            }

            const productId = session.metadata?.product_id;
            const email = session.customer_details?.email;
            let isNewUser = false;
            let generatedPassword = '';

            if (!userId) {
                if (email) {
                    console.log(`[Stripe Webhook] No user ID found... Attempting creation/fetch for ${email}`);
                    generatedPassword = Math.random().toString(36).slice(-8); // Generate an 8-character password

                    // Try to create the user
                    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
                        email: email,
                        password: generatedPassword,
                        email_confirm: true,
                        user_metadata: {
                            full_name: session.customer_details?.name || 'Parent'
                        }
                    });

                    if (createError && createError.message.includes('already registered')) {
                        console.log(`[Stripe Webhook] User ${email} already exists. Fetching user ID directly.`);
                        // Fetch the existing user's ID
                        const { data: profiles, error: profileErr } = await supabase.from('profiles').select('id').eq('email', email).limit(1);

                        if (profiles && profiles.length > 0) {
                            userId = profiles[0].id;
                            console.log(`[Stripe Webhook] Recovered existing user ID: ${userId}`);
                            generatedPassword = ''; // Existing user, don't send a password
                        } else {
                            // Fallback if profile doesn't exist but auth user does
                            const { data: users, error: userErr } = await supabase.auth.admin.listUsers();
                            const existingUser = users?.users?.find(u => u.email === email);
                            if (existingUser) {
                                userId = existingUser.id;
                                console.log(`[Stripe Webhook] Recovered existing auth user ID: ${userId}`);
                                generatedPassword = '';
                            } else {
                                console.error("[Stripe Webhook] Failed to recover existing user ID:", profileErr || userErr);
                                return NextResponse.json({ error: 'Failed to find existing user' }, { status: 500 });
                            }
                        }
                    } else if (newUser?.user) {
                        userId = newUser.user.id;
                        isNewUser = true;
                        console.log(`[Stripe Webhook] Created new guest user ID: ${userId}`);
                    } else {
                        console.error("[Stripe Webhook] Error creating guest user:", createError);
                        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
                    }
                } else {
                    console.error("[Stripe Webhook] No user ID and no email found in session.");
                    return NextResponse.json({ error: 'No user ID found' }, { status: 400 });
                }
            }

            // Always update the profile to link the Stripe customer ID and clear deleted_at (revive zombie accounts)
            if (userId && session.customer && typeof session.customer === 'string') {
                await supabase.from('profiles').update({
                    stripe_customer_id: session.customer,
                    full_name: session.customer_details?.name || 'Parent',
                    deleted_at: null // Crucial: Restore account if it was previously deleted
                }).eq('id', userId);
            }

            // Always send the Welcome / Recovery Email for appropriate space
            if (userId && email) {
                try {
                    const { Resend } = await import('resend');
                    const resend = new Resend(process.env.RESEND_API_KEY!);

                    const isAdult = session.metadata?.space === 'adults';

                    try {
                        const emailModule = isAdult
                            ? await import('@/components/emails/WelcomeAdultEmail')
                            : await import('@/components/emails/WelcomeKidEmail');
                        const WelcomeEmail = emailModule.default;

                        const fromEmail = process.env.NODE_ENV === 'development'
                            ? (isAdult ? "L'Atelier des Magiciens <onboarding@resend.dev>" : 'Club des Petits Magiciens <onboarding@resend.dev>')
                            : (isAdult ? "L'Atelier des Magiciens <contact@atelierdesmagiciens.fr>" : 'Club des Petits Magiciens <contact@clubdespetitsmagiciens.fr>');

                        const subject = isAdult
                            ? "Bienvenue dans L'Atelier des Magiciens 🎩✨"
                            : "Bienvenue au Club des Petits Magiciens ! 🎩✨";

                        await resend.emails.send({
                            from: fromEmail,
                            to: [email],
                            subject: subject,
                            react: WelcomeEmail({
                                username: email, // display email as username identifier
                                loginUrl: isAdult
                                    ? 'https://atelierdesmagiciens.fr/login'
                                    : 'https://clubdespetitsmagiciens.fr/login',
                                password: generatedPassword || undefined
                            }),
                        });
                        console.log(`[Stripe Webhook] Welcome email sent to ${email}`);
                    } catch (emailImportError) {
                        console.error("[Stripe Webhook] Could not import WelcomeEmail react component. Sending basic text email.", emailImportError);
                        await resend.emails.send({
                            from: isAdult ? "L'Atelier des Magiciens <contact@atelierdesmagiciens.fr>" : 'Club des Petits Magiciens <contact@clubdespetitsmagiciens.fr>',
                            to: [email],
                            subject: isAdult ? "Bienvenue dans l'Atelier ! 🎩✨" : 'Bienvenue au Club des Petits Magiciens ! 🎩✨',
                            html: `<p>Votre compte a été activé avec succès ! Connectez-vous sur notre site avec l'email ${email} ${generatedPassword ? `et le mot de passe provisoire : ${generatedPassword}` : ''}.</p>`
                        });
                    }
                } catch (e) {
                    console.error("[Stripe Webhook] Error sending welcome email:", e);
                }
            }

            console.log(`[Stripe Webhook] Processing completion for User: ${userId}, Product: ${productId}`);

            // 1. If it's a product-based purchase
            if (productId) {
                const { data: product } = await supabase
                    .from('products')
                    .select('*')
                    .eq('id', productId)
                    .single();

                if (product) {
                    // 1a. Handle Subscriptions
                    if (product.type === 'subscription') {
                        console.log(`[Stripe Webhook] Activating subscription for user ${userId}`);
                        const isKidProduct = product.space === 'kids';
                        const { error: profileError } = await supabase
                            .from('profiles')
                            .update({
                                subscription_status: 'active',
                                access_level: isKidProduct ? 'kid' : 'adult',
                                role: isKidProduct ? 'kid' : 'adult'
                            })
                            .eq('id', userId);

                        if (profileError) console.error("[Stripe Webhook] Profile update error:", profileError);
                    }

                    // 1b. Handle One-time items (packs, courses) linked to this product
                    // Find all library items linked to this product
                    const { data: linkedItems } = await supabase
                        .from('library_items')
                        .select('id')
                        .eq('linked_product_id', productId);

                    if (linkedItems && linkedItems.length > 0) {
                        for (const item of linkedItems) {
                            await supabase.from('user_purchases').upsert({
                                user_id: userId,
                                library_item_id: item.id,
                                product_id: productId,
                                status: 'active',
                                systeme_io_order_id: session.id
                            }, { onConflict: 'user_id,library_item_id' });
                        }
                        console.log(`[Stripe Webhook] Unlocked ${linkedItems.length} items for product ${productId}`);
                    }
                }
            }

            // 2. If it's a specific library item passed directly (fallback/legacy)
            if (libraryItemId) {
                console.log(`[Stripe Webhook] Unlocking specific item ${libraryItemId}`);
                await supabase.from('user_purchases').upsert({
                    user_id: userId,
                    library_item_id: libraryItemId,
                    status: 'active',
                    systeme_io_order_id: session.id
                }, { onConflict: 'user_id,library_item_id' });
            }
        }

        return NextResponse.json({ received: true }, { status: 200 });
    } catch (error: any) {
        console.error("[Stripe Webhook] Unhandled error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
