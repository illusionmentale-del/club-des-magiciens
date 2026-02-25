import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as React from "react";
// Ensure to transpile correctly or just require it if module setup allows
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
            
            const chunk = bccList.slice(0, 50);
            console.log("Attempting Resend send...");
            
            const { data, error } = await resend.emails.send({
                from: 'Club des Petits Magiciens <contact@clubdespetitsmagiciens.fr>',
                to: ['notifications@clubdespetitsmagiciens.fr'], // Dummy TO
                bcc: chunk,
                subject: 'Test Broadcast Real',
                react: React.createElement(ReplyNotificationEmail, {
                    kidName: 'Apprentis Magiciens',
                    videoUrl: "https://clubdespetitsmagiciens.fr",
                    messageContent: "Test content",
                    mediaTitle: "Test media"
                }) as any
            });
            
            console.log("Data:", data, "Error:", error);
        }
    } catch (e) {
        console.error("Caught Exception:", e);
    }
}
test();
