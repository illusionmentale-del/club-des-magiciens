const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function check() {
  const events = await stripe.events.list({ types: ['checkout.session.completed'], limit: 5 });
  console.log("LAST 5 CHECKOUT COMPLETED EVENTS:");
  events.data.forEach(e => {
    const session = e.data.object;
    console.log(`- Time: ${new Date(e.created * 1000).toISOString()} | Email: ${session.customer_details?.email} | Name: ${session.customer_details?.name} | Amount: ${session.amount_total} | Status: ${session.status}`);
  });
}
check();
