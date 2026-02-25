const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function check() {
    const customer = await stripe.customers.retrieve('cus_U2YUo98CMo1ZUy');
    console.log("Customer Email:", customer.email);
    console.log("Customer Metadata:", customer.metadata);

    // Also fetch cus_U2WiwqmFZpTetQ (the one at 19:53)
    const customer2 = await stripe.customers.retrieve('cus_U2WiwqmFZpTetQ');
    console.log("Customer2 Email:", customer2.email);
    console.log("Customer2 Metadata:", customer2.metadata);
}
check();
