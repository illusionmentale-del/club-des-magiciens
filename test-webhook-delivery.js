const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function check() {
    const events = await stripe.events.list({ types: ['checkout.session.completed'], limit: 1 });
    const event = JSON.parse(JSON.stringify(events.data[0])); // The latest one
    console.log("LAST EVENT ID:", event.id, "Created:", new Date(event.created * 1000).toISOString());

    // Use the native SDK!
    const endpoints = await stripe.webhookEndpoints.list({});
    const ep = endpoints.data[0];

    try {
        const resResponse = await fetch(`https://api.stripe.com/v1/events/${event.id}`, {
            headers: {
                "Authorization": `Bearer ${process.env.STRIPE_SECRET_KEY}`
            }
        });
        const evData = await resResponse.json();

        // Webhook delivery attempts
        const delRes = await fetch(`https://api.stripe.com/v1/webhook_endpoints/${ep.id}/events/${event.id}/delivery_attempts`, {
            headers: {
                "Authorization": `Bearer ${process.env.STRIPE_SECRET_KEY}`
            }
        });
        const delData = await delRes.json();
        console.log("Delivery Data:", JSON.stringify(delData, null, 2));

    } catch (e) {
        console.error(e);
    }
}
check();
