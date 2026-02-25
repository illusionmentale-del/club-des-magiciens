const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function check() {
    const events = await stripe.events.list({ types: ['checkout.session.completed'], limit: 1 });
    const event = events.data[0];
    console.log("Event ID:", event.id);

    // You cannot list delivery attempts directly via node SDK without specific beta headers, but let's try reading the event itself, maybe it failed fast?
    // Actually, wait, let's just make a dummy request to the webhook endpoint locally to see the crash.
}
check();
