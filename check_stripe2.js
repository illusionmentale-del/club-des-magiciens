const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function check() {
    console.log("Checking recent checkout sessions for cnftwm2thf...");
    const sessions = await stripe.checkout.sessions.list({ limit: 10 });
    const target = sessions.data.find(s => 
        (s.customer_details && s.customer_details.email === 'cnftwm2thf@privaterelay.appleid.com') ||
        s.customer_email === 'cnftwm2thf@privaterelay.appleid.com'
    );
    
    if (target) {
        console.log("Found Session ID:", target.id);
        console.log("Email in Stripe:", target.customer_details?.email);
        console.log("Payment Status:", target.payment_status);
        console.log("Created:", new Date(target.created * 1000).toISOString());
    } else {
        console.log("Specific session not found in last 10.");
    }
}
check().catch(console.error);
