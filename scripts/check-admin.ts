

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Read .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local');
const envFile = fs.readFileSync(envPath, 'utf8');
const envVars = envFile.split('\n').reduce((acc, line) => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
        acc[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, ''); // Remove quotes
    }
    return acc;
}, {} as Record<string, string>);

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseServiceKey = envVars['SUPABASE_SERVICE_ROLE_KEY'];

if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing env vars");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkRoles() {
    const { data: users, error } = await supabase.from('profiles').select('id, username, full_name, role, access_level');
    if (error) {
        console.error("Error fetching profiles:", error);
        return;
    }
    console.log("--- User Roles ---");
    users.forEach(u => {
        console.log(`User: ${u.username || u.full_name} (${u.id}) - Role: ${u.role} - Access: ${u.access_level}`);
    });
}

checkRoles();

