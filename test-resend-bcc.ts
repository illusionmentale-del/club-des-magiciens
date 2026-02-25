import { Resend } from "resend";
import * as dotenv from "dotenv";
import { createElement } from "react";
// We don't import the actual react email component to avoid compiling issues in raw TS node,
// we just send a simple HTML string for the test.
dotenv.config({ path: ".env.local" });

const resend = new Resend(process.env.RESEND_API_KEY);

async function test() {
    const bccList = ["minima02_emaux@icloud.com", "nruqy46vjm@privaterelay.appleid.com", "66.titanesque_ainee@icloud.com"];
    
    try {
        const { data, error } = await resend.emails.send({
            from: 'Club des Petits Magiciens <contact@clubdespetitsmagiciens.fr>',
            to: ['notifications@clubdespetitsmagiciens.fr'], // Dummy TO
            bcc: bccList,
            subject: 'Test Broadcast BCC',
            html: '<p>Ceci est un test de broadcast BCC depuis le script local.</p>'
        });
        
        console.log("Resend Data:", data);
        console.log("Resend Error:", error);
    } catch (e) {
        console.error("Caught Exception:", e);
    }
}
test();
