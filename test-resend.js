const { Resend } = require('resend');
require('dotenv').config({ path: '.env.local' });
const resend = new Resend(process.env.RESEND_API_KEY);

async function check() {
  try {
    const { data, error } = await resend.emails.list();
    if (error) throw error;
    console.log("LAST 5 EMAILS SENT VIA RESEND:");
    data.data.slice(0, 5).forEach(e => {
      console.log(`- Time: ${new Date(e.created_at).toISOString()} | To: ${e.to[0]} | Subject: ${e.subject}`);
    });
  } catch (err) {
    console.error(err);
  }
}
check();
