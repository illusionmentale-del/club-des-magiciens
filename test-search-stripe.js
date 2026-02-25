const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function check() {
  console.log("Searching Stripe Customers...");
  const customers = await stripe.customers.search({
    query: "email:\'ambient-rostre.9c@icloud.com\'",
  });
  console.log("Found customers:", customers.data.length);
  
  if (customers.data.length > 0) {
      console.log(customers.data[0].id);
  } else {
      console.log("No Stripe customer found with this explicit email.");
  }
}
check();
