const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function check() {
  try {
    const events = await stripe.events.list({ types: ['checkout.session.completed'], limit: 1 });
    const session = events.data[0].data.object;
    console.log("LAST CHECKOUT SESSION DATA:");
    console.log(`Email: ${session.customer_details?.email}`);
    console.log(`Metadata:`, session.metadata);
    console.log(`Client Ref ID:`, session.client_reference_id);
    console.log(`Product ID derived:`, session.metadata?.product_id);
  } catch (err) {
    console.error(err.message);
  }
}
check();
