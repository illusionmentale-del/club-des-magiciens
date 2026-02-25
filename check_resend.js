const { Resend } = require('resend');
require('dotenv').config({ path: '.env.local' });

const resend = new Resend(process.env.RESEND_API_KEY);

async function check() {
    try {
        console.log("Checking Resend emails...");
        const response = await resend.emails.list();
        if (response.data && response.data.data) {
            console.log("Last 10 emails sent via Resend:");
            response.data.data.slice(0, 10).forEach(e => {
                console.log(`To: ${e.to}, Subject: ${e.subject}, Status: ${e.status}, Created: ${e.created_at}`);
            });
        } else {
            console.log("No emails found or error:", response);
        }
    } catch(e) {
        console.error("Error fetching from Resend:", e);
    }
}
check();
