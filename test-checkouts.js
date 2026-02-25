const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function check() {
  const sessions = await stripe.checkout.sessions.list({ limit: 3 });
  console.log("LAST 3 SESSIONS:");
  sessions.data.forEach(s => {
      console.log(`- ID: ${s.id} | Email: ${s.customer_details?.email} | Name: ${s.customer_details?.name}`);
  });
}
check();
