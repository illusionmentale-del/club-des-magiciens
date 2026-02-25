const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function check() {
  const session = await stripe.checkout.sessions.retrieve('cs_live_b12znfz21EIcY1ZhmFYKnFiPhc45iG3Sc9yfrtgg68TMLHPUJFLxrDXWrR', {
    expand: ['customer']
  });
  console.log("SESSION ID:", session.id);
  console.log("Session Email:", session.customer_email);
  console.log("Customer Details Email:", session.customer_details?.email);
  console.log("Customer Object Email:", session.customer?.email);
  console.log("Client Reference ID:", session.client_reference_id);
  console.log("Metadata:", session.metadata);
}
check();
