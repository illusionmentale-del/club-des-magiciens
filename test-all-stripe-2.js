const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function check() {
  const sessions = await stripe.checkout.sessions.list({ limit: 10 });
  console.log("LAST 10 SESSIONS CREATED:");
  sessions.data.forEach(s => {
    console.log(`- Time: ${new Date(s.created * 1000).toISOString()} | Status: ${s.status} | Email: ${s.customer_details?.email}`);
  });
}
check();
