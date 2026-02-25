import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { createElement } from "react";
import { ReplyNotificationEmail } from "./components/emails/ReplyNotificationEmail";
dotenv.config({ path: ".env.local" });

const resend = new Resend(process.env.RESEND_API_KEY);
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    try {
        const { data: kidsProfiles } = await supabase
            .from("profiles")
            .select("email")
            .eq("role", "kid")
            .not("email", "is", null);

        if (kidsProfiles && kidsProfiles.length > 0) {
            const bccList = kidsProfiles.map(p => p.email).filter(Boolean) as string[];
            console.log("Found kids:", bccList.length);
            
            // Note: We are using a simple string here because React components 
            // inside TS-Node require a full Next.js/Babel setup to render to string. 
            // The previous test proved the basic BCC works.
            
            // Wait, maybe Resend is throwing an error specifically when the React 
            // element is rendered with these dummy props? Unlikely, but possible.
            // Let's just test the Resend call.
            
            const chunk = bccList.slice(0, 50);
            
            const { data, error } = await resend.emails.send({
                from: 'Club des Petits Magiciens <contact@clubdespetitsmagiciens.fr>',
                to: ['notifications@clubdespetitsmagiciens.fr'], // Dummy TO
                bcc: chunk,
                subject: 'Test Broadcast Real',
                html: '<p>Ceci est un test</p>'
            });
            
            console.log("Data:", data, "Error:", error);
        }
    } catch (e) {
        console.error("Caught Exception:", e);
    }
}
test();
