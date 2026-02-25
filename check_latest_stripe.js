const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function check() {
    const sessions = await stripe.checkout.sessions.list({ limit: 3 });
    sessions.data.forEach(s => {
        console.log("ID:", s.id);
        console.log("Created:", new Date(s.created * 1000).toISOString());
        console.log("Email:", s.customer_details?.email || s.customer_email);
        console.log("Status:", s.payment_status);
        console.log("---");
    });
}
check().catch(console.error);
