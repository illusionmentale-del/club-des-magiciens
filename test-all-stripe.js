const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function check() {
  const events = await stripe.events.list({ types: ['checkout.session.completed'], limit: 10 });
  console.log("LAST 10 CHECKOUTS:");
  events.data.forEach(e => {
    const session = e.data.object;
    console.log(`- Time: ${new Date(e.created * 1000).toISOString()} | ID: ${session.id} | Email: ${session.customer_details?.email} | Customer: ${session.customer}`);
  });
}
check();
