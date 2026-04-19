import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
    try {
        const supabase = await createClient();

        // Security checks
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });

        // Ensure user is admin via database role check
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        if (profile?.role !== 'admin' && profile?.role !== 'super_admin') {
            return NextResponse.json({ error: 'Accès interdit. Seuls les administrateurs peuvent envoyer des newsletters.' }, { status: 403 });
        }

        const { subject, content, targetAudience, template = 'classic', selectedCourseId, selectedProductId, isTest } = await req.json();

        if (!subject) {
            return NextResponse.json({ error: 'Sujet obligatoire.' }, { status: 400 });
        }

        const fromEmail = process.env.NODE_ENV === 'development'
            ? "L'Atelier des Magiciens <onboarding@resend.dev>"
            : "L'Atelier des Magiciens <contact@clubdespetitsmagiciens.fr>"; // Enforced fallback domain

        let emailsToTarget: string[] = [];

        if (isTest) {
            // Send only to the active admin user
            emailsToTarget = [user.email!];
        } else {
            // Fetch relevant users who opted in
            let query = supabase.from('profiles').select('email, first_name').eq('newsletter_opt_in', true).is('deleted_at', null);

            if (targetAudience === 'adults') {
                query = query.eq('has_adults_access', true);
            } else if (targetAudience === 'kids') {
                query = query.eq('has_kids_access', true);
            }

            const { data: profiles, error } = await query;

            if (error) {
                console.error("Erreur récupération:", error);
                throw error;
            }

            if (!profiles || profiles.length === 0) {
                return NextResponse.json({ error: "Aucun utilisateur inscrit à la newsletter pour cette cible." }, { status: 400 });
            }

            emailsToTarget = [...new Set(profiles.filter(p => p.email && p.email.includes('@')).map(p => p.email))]; // Remove potential duplicates and invalid/null emails
        }

        // --- FETCH DYNAMIC CONTENT FOR TRAMES ---
        let courseData = null;
        let productData = null;

        if (template === 'course_focus' && selectedCourseId) {
            const { data } = await supabase.from('library_items').select('id, title, description, thumbnail_url, audience').eq('id', selectedCourseId).single();
            courseData = data;
        }

        if (template === 'product_focus' && selectedProductId) {
            const { data } = await supabase.from('products').select('id, title, description, price, thumbnail_url, space').eq('id', selectedProductId).single();
            productData = data;
        }

        // --- HTML GENERATOR FUNCS ---
        const formatMessage = (text: string) => {
            if (!text) return "";
            return text.replace(/\n\n/g, '</p><p style="margin-bottom: 16px;">')
                .replace(/\n/g, '<br />');
        };

        const generateHtmlPayload = () => {
            const formattedContent = `<p style="margin-bottom: 16px;">${formatMessage(content)}</p>`;
            let mainContentHtml = '';

            // TRAME 1 : CLASSIQUE
            if (template === 'classic') {
                mainContentHtml = formattedContent;
            }

            // TRAME 2 : COURSE FOCUS
            else if (template === 'course_focus' && courseData) {
                const link = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.clubdespetitsmagiciens.fr'}/${courseData.audience === 'kids' ? 'kids/library' : 'dashboard/masterclass'}`;

                mainContentHtml = `
                    ${formattedContent}
                    
                    <div style="background-color: #1a1a1a; border-radius: 12px; overflow: hidden; margin: 30px 0; border: 1px solid #333;">
                        ${courseData.thumbnail_url ? `<img src="${courseData.thumbnail_url}" alt="${courseData.title}" style="width: 100%; height: auto; display: block; filter: brightness(0.9);" />` : ''}
                        <div style="padding: 24px;">
                            <h2 style="color: #eab308; margin-top: 0; margin-bottom: 12px; font-size: 20px;">${courseData.title}</h2>
                            <p style="color: #a3a3a3; font-size: 14px; line-height: 1.5; margin-bottom: 24px;">
                                ${courseData.description || "Découvrez cette nouvelle vidéo complète sur votre espace membre."}
                            </p>
                            <a href="${link}" style="display: inline-block; background-color: #eab308; color: #000; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; font-size: 14px;">▶ Regarder maintenant</a>
                        </div>
                    </div>
                `;
            }

            // TRAME 3 : PRODUCT FOCUS
            else if (template === 'product_focus' && productData) {
                const link = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.clubdespetitsmagiciens.fr'}/${productData.space === 'kids' ? 'kids/shop' : 'dashboard/catalog'}`;

                mainContentHtml = `
                    ${formattedContent}
                    
                    <div style="background-color: #f8fafc; border-radius: 12px; overflow: hidden; margin: 30px 0; border: 1px solid #e2e8f0;">
                        ${productData.thumbnail_url ? `<img src="${productData.thumbnail_url}" alt="${productData.title}" style="width: 100%; height: auto; display: block;" />` : ''}
                        <div style="padding: 24px; text-align: center;">
                            <h2 style="color: #0f172a; margin-top: 0; margin-bottom: 8px; font-size: 20px;">${productData.title}</h2>
                            <div style="display: inline-block; background-color: #06b6d4; color: #fff; font-weight: bold; padding: 4px 12px; border-radius: 6px; font-size: 14px; margin-bottom: 16px;">
                                ${productData.price} €
                            </div>
                            <p style="color: #64748b; font-size: 14px; line-height: 1.5; margin-bottom: 24px;">
                                ${productData.description || "Ajoutez cette nouveauté à votre répertoire !"}
                            </p>
                            <a href="${link}" style="display: inline-block; background-color: #0f172a; color: #fff; text-decoration: none; padding: 12px 30px; border-radius: 8px; font-weight: bold; font-size: 14px;">Voir dans la boutique</a>
                        </div>
                    </div>
                `;
            }

            return `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #111; max-width: 600px; margin: 0 auto; line-height: 1.6;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <img src="https://zcljymosqckntukshzrm.supabase.co/storage/v1/object/public/website-assets/logo-v2.png" width="120" alt="Logo" style="border-radius: 8px;">
                    </div>
                    
                    <div style="font-size: 16px;">
                        ${mainContentHtml}
                    </div>
                    
                        <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 40px 0;" />
                        <p style="font-size: 12px; color: #888; text-align: center;">
                            Vous recevez cet e-mail car vous êtes inscrit(e) aux actualités de L'Atelier / Club des Magiciens communiquée lors de vos achats.<br/>
                            <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.clubdespetitsmagiciens.fr'}/api/unsubscribe?email={{contact.email}}" style="color: #666; text-decoration: underline;">Se désabonner en 1 clic</a>
                        </p>
                </div>
            `;
        };

        const finalHtml = generateHtmlPayload();

        // Send via Resend (Using Audience/Batch if more than 50 emails ideally, but Resend handles reasonable arrays in `to` up to 50 for standard sends. For broader broadcasts, batching is needed).
        const BATCH_SIZE = 50;
        const batchRequests = [];

        let sentCount = 0;

        for (let i = 0; i < emailsToTarget.length; i += BATCH_SIZE) {
            const batch = emailsToTarget.slice(i, i + BATCH_SIZE);

            const payload = batch.map(email => ({
                from: fromEmail,
                to: [email],
                subject: subject,
                html: finalHtml.replace('{{contact.email}}', encodeURIComponent(email))
            }));

            const { data, error } = await resend.batch.send(payload);

            if (error) {
                console.error(`Erreur envoi batch de l'index ${i}:`, error);
                // Keep trying other batches instead of failing entirely
            } else {
                sentCount += batch.length;
            }
        }

        return NextResponse.json({ success: true, count: sentCount }, { status: 200 });

    } catch (error: any) {
        console.error("Newsletter API Error:", error);
        return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
    }
}
