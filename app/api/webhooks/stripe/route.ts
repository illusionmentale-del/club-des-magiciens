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
            console.error("Missing Stripe signature or Webhook Secret. Ensure STRIPE_WEBHOOK_SECRET is set.");
            return NextResponse.json({ error: 'Missing configuration or signature' }, { status: 400 });
        }

        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        } catch (err: any) {
            console.error(`Webhook signature verification failed: ${err.message}`);
            return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
        }

        console.log(`[Stripe Webhook] Received event: ${event.type}`);

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session;

            let userId = session.metadata?.user_id;
            let libraryItemId = session.metadata?.library_item_id;

            // Safe identity resolution (client_reference_id now ONLY contains user ID from checkout)
            if (session.client_reference_id) {
                userId = userId || session.client_reference_id;
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
                const optIn = session.consent?.promotions === 'opt_in';
                const updateData: any = {
                    stripe_customer_id: session.customer,
                    full_name: session.customer_details?.name || 'Parent',
                    deleted_at: null // Crucial: Restore account if it was previously deleted
                };

                // Only update newsletter preference if consent was actually prompted
                if (session.consent?.promotions) {
                    updateData.newsletter_opt_in = optIn;
                }

                await supabase.from('profiles').update(updateData).eq('id', userId);
            }

            // Send the Welcome Email ONLY to NEW users (Stripe handles receipts for existing users)
            if (userId && email && isNewUser) {
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
                            // Use clubdespetitsmagiciens.fr for BOTH to bypass Resend free tier limits (1 domain max)
                            : (isAdult ? "L'Atelier des Magiciens <contact@clubdespetitsmagiciens.fr>" : 'Club des Petits Magiciens <contact@clubdespetitsmagiciens.fr>');

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
                        console.log(`[Stripe Webhook] Welcome email sent to new user ${email}`);
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
            } else if (userId && email && !isNewUser) {
                console.log(`[Stripe Webhook] Existing user ${email} bought an item. Skipping Welcome Email (handled by Stripe receipt).`);
            }

            console.log(`[Stripe Webhook] Processing completion for User: ${userId}, Product: ${productId}`);

            // FETCH LINE ITEMS FROM STRIPE TO DETERMINE ALL PURCHASED PRODUCTS
            const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
            let grantsAdultAccess = false;
            let grantsKidsAccess = false;
            let isAnnualPlan = false;

            // Analyze what the user actually purchased
            for (const item of lineItems.data) {
                if (!item.price) continue;

                if (item.price.recurring?.interval === 'year') {
                    isAnnualPlan = true;
                }

                // Find matching product in Supabase by Stripe Price ID
                const { data: matchedProduct } = await supabase
                    .from('products')
                    .select('*')
                    .eq('stripe_price_id', item.price.id)
                    .single();

                if (matchedProduct) {
                    if (matchedProduct.space === 'adults') grantsAdultAccess = true;
                    if (matchedProduct.space === 'kids') grantsKidsAccess = true;

                    // Handle One-time items (packs, courses) linked to this product
                    const { data: linkedItems } = await supabase
                        .from('library_items')
                        .select('id')
                        .eq('linked_product_id', matchedProduct.id);

                    if (linkedItems && linkedItems.length > 0) {
                        for (const linked of linkedItems) {
                            await supabase.from('user_purchases').upsert({
                                user_id: userId,
                                library_item_id: linked.id,
                                product_id: matchedProduct.id,
                                status: 'active',
                                systeme_io_order_id: session.id
                            }, { onConflict: 'user_id,library_item_id' });

                            // Grant +10 XP (Progression boost & Cashback) for getting a trick
                            await supabase.from('user_xp_logs').insert({
                                user_id: userId,
                                action_type: 'trick_unlocked_boost_stripe',
                                xp_awarded: 10,
                                reference_id: `boost_${session.id}_${linked.id}`
                            });
                        }
                        console.log(`[Stripe Webhook] Unlocked ${linkedItems.length} items for product ${matchedProduct.id}`);
                    }
                }
            }

            // We have the true access rights based on everything in the cart (Cross-sells included)
            if (grantsAdultAccess || grantsKidsAccess) {
                console.log(`[Stripe Webhook] Activating subscription for user ${userId}. Adults: ${grantsAdultAccess}, Kids: ${grantsKidsAccess}`);

                // Fetch existing access to preserve it if they already had something
                const { data: currentProfile } = await supabase
                    .from('profiles')
                    .select('has_adults_access, has_kids_access')
                    .eq('id', userId)
                    .single();

                const finalAdultsAccess = grantsAdultAccess || (currentProfile?.has_adults_access === true);
                const finalKidsAccess = grantsKidsAccess || (currentProfile?.has_kids_access === true);

                const { error: profileError } = await supabase
                    .from('profiles')
                    .update({
                        subscription_status: 'active',
                        has_adults_access: finalAdultsAccess,
                        has_kids_access: finalKidsAccess,
                        // Set legacy role based on primary purchase
                        access_level: finalAdultsAccess ? 'adult' : 'kid',
                        role: finalAdultsAccess ? 'adult' : 'kid',
                        is_annual_subscriber: isAnnualPlan
                    })
                    .eq('id', userId);

                if (profileError) console.error("[Stripe Webhook] Profile update error:", profileError);
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

                // Grant +10 XP (Progression boost & Cashback) for getting a trick
                await supabase.from('user_xp_logs').insert({
                    user_id: userId,
                    action_type: 'trick_unlocked_boost_stripe_direct',
                    xp_awarded: 10,
                    reference_id: `boost_${session.id}_${libraryItemId}`
                });
            }
        }

        if (event.type === 'invoice.paid') {
            const invoice = event.data.object as Stripe.Invoice;
            const customerId = invoice.customer as string;
            const amountPaid = invoice.amount_paid; // in cents (e.g., 499 for 4.99€)

            if (customerId && typeof customerId === 'string') {
                // Find user by stripe_customer_id
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('id')
                    .eq('stripe_customer_id', customerId)
                    .single();

                if (profile && profile.id) {
                    let xpToAward = 0;
                    let actionType = '';

                    // Monthly Plan (around 4.99€) -> 499 cents. Using >= 400 and <= 1000 to be safe
                    if (amountPaid >= 400 && amountPaid <= 1000) {
                        xpToAward = 100;
                        actionType = 'abonnement_mensuel';
                    } 
                    // Annual Plan (around 49.90€) -> 4990 cents. Using >= 4000
                    else if (amountPaid >= 4000 && amountPaid <= 10000) {
                        xpToAward = 500;
                        actionType = 'premium_annuel_bonus';
                    }

                    if (xpToAward > 0) {
                        // Unique invoice.id prevents double accounting
                        const { error: xpError } = await supabase.from('user_xp_logs').insert({
                            user_id: profile.id,
                            action_type: actionType,
                            xp_awarded: xpToAward,
                            reference_id: `invoice_${invoice.id}`
                        });
                        if (xpError) {
                            if (xpError.code !== '23505') { // Ignore duplicate key errors
                                console.error(`[Stripe Webhook] Failed to grant XP:`, xpError);
                            }
                        } else {
                            console.log(`[Stripe Webhook] Granted ${xpToAward} XP to user ${profile.id} for invoice ${invoice.id}`);
                        }
                    }
                }
            }
        }

        return NextResponse.json({ received: true }, { status: 200 });
    } catch (error: any) {
        console.error("[Stripe Webhook] Unhandled error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
