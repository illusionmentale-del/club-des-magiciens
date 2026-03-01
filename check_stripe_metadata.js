const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function checkEvents() {
  console.log("Fetching recent Stripe checkout.session.completed events...");
  
  try {
    const events = await stripe.events.list({
      type: 'checkout.session.completed',
      limit: 3,
    });
    
    for (const event of events.data) {
      const session = event.data.object;
      console.log(`\n--- Event ID: ${event.id} ---`);
      console.log(`Customer Email: ${session.customer_details?.email}`);
      console.log(`Amount Total: ${session.amount_total}`);
      console.log(`Session Metadata:`, session.metadata);
      console.log(`Client Reference ID:`, session.client_reference_id);
      
      // Also get line items to see the products
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
      console.log(`Line Items:`);
      lineItems.data.forEach(item => {
          console.log(`  - ${item.description} (Price ID: ${item.price?.id})`);
      });
    }
  } catch (e) {
      console.error("Error connecting to Stripe:", e);
  }
}

checkEvents();
