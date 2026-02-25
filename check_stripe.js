const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function check() {
    console.log("Checking recent checkout sessions...");
    const sessions = await stripe.checkout.sessions.list({ limit: 10 });
    const target = sessions.data.find(s => 
        (s.customer_details && s.customer_details.email === 'encodeur-chrome-4r@icloud.com') ||
        s.customer_email === 'encodeur-chrome-4r@icloud.com' ||
        (s.customer_details && s.customer_details.email && s.customer_details.email.includes('encodeur'))
    );
    
    if (target) {
        console.log("Found Session ID:", target.id);
        console.log("Email in Stripe:", target.customer_details?.email);
        console.log("Payment Status:", target.payment_status);
        
        // Fetch webhook events related to this session or generally recent events
        const events = await stripe.events.list({ types: ['checkout.session.completed'], limit: 10 });
        const eventForSession = events.data.find(e => e.data.object.id === target.id);
        if (eventForSession) {
             console.log("Event Type:", eventForSession.type);
             console.log("Customer Details Email:", eventForSession.data.object.customer_details?.email);
             
             // How can we tell if it failed? We can't see the webhook delivery from here easily without dashboard.
             // But let's see the metadata
             console.log("Metadata:", eventForSession.data.object.metadata);
        } else {
             console.log("No checkout.session.completed event found in the last 10 events for this session.");
        }
    } else {
        console.log("Specific session not found in last 10. Let's just list the emails of the last 5 sessions:");
        sessions.data.slice(0, 5).forEach(s => console.log(s.id, s.customer_details?.email, s.payment_status));
    }
}
check().catch(console.error);
