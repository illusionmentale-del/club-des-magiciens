const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const email = 'ambient-rostre.9c@icloud.com';
  console.log(`Checking email: ${email}`);

  // 1. Check Supabase User
  const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();
  const user = usersData?.users.find(u => u.email === email);
  if (user) {
    console.log(`[Supabase] User Found: ID=${user.id}, Created=${user.created_at}`);
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    console.log(`[Supabase] Profile: `, profile);
  } else {
    console.log(`[Supabase] User NOT found in auth.users (first 50)`);
    // Try to find if generateLink works for them
    const { data: link, error: linkErr } = await supabase.auth.admin.generateLink({ type: 'magiclink', email });
    if (link?.user) console.log(`[Supabase] User Found via generateLink: ID=${link.user.id}`);
    else console.log(`[Supabase] User completely missing. Error:`, linkErr);
  }

  // 2. Check Stripe Checkout Sessions
  console.log(`\nChecking Stripe Checkout Sessions...`);
  const sessions = await stripe.checkout.sessions.list({ limit: 5 });
  const mySession = sessions.data.find(s => s.customer_details?.email === email);
  if (mySession) {
    console.log(`[Stripe] Session Found! ID=${mySession.id}, Status=${mySession.status}, Payment=${mySession.payment_status}`);
    console.log(`[Stripe] Metadata:`, mySession.metadata);
  } else {
    console.log(`[Stripe] No recent checkout session found for this email.`);
  }

  // 3. Check Stripe Webhook Events
  console.log(`\nChecking Stripe Events...`);
  const events = await stripe.events.list({ types: ['checkout.session.completed'], limit: 5 });
  const myEvent = events.data.find(e => e.data.object.customer_details?.email === email);
  if (myEvent) {
    console.log(`[Stripe] Webhook Event Found! ID=${myEvent.id}, Created=${new Date(myEvent.created * 1000).toISOString()}`);
  } else {
    console.log(`[Stripe] No checkout.session.completed event found for this email in the last 5 events.`);
  }
}
check();
