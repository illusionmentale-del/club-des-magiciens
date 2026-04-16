import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function run() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`, { headers: { apikey: process.env.SUPABASE_SERVICE_ROLE_KEY }});
    const schema = await res.json();
    console.log(schema);
    
    // Also try to query PG using direct API call if it works
}
run();
