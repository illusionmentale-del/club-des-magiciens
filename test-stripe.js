const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function check() {
  try {
    const events = await stripe.events.list({ limit: 5 });
    console.log("LAST 5 STRIPE EVENTS:");
    events.data.forEach(e => console.log(`- ${e.type} | Created: ${new Date(e.created * 1000).toISOString()}`));
    
    // Check if the webhook endpoint is configured correctly
    const endpoints = await stripe.webhookEndpoints.list({});
    console.log("\nWEBHOOK ENDPOINTS:");
    endpoints.data.forEach(ep => console.log(`- URL: ${ep.url} | Status: ${ep.status}`));
  } catch (err) {
    console.error("Stripe API Error:", err.message);
  }
}
check();
