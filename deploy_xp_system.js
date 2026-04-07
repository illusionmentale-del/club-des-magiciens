require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL || `postgres://postgres.[PROJECT_REF]:${process.env.SUPABASE_DB_PASSWORD}@aws-0-eu-central-1.pooler.supabase.com:6543/postgres`;

// Since we have NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, but pg requires a direct DB connection,
// wait, the standard env file usually has DIRECT_URL or DATABASE_URL.
