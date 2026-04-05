const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function backupExternal() {
    console.log("Starting Backup for Supabase Auth and Resend...");
    
    // 1. SUPABASE AUTH USERS
    try {
        console.log("Fetching Supabase Auth Users...");
        let allUsers = [];
        let hasMore = true;
        let page = 1;
        while(hasMore) {
            const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 });
            if (error) throw error;
            if (data && data.users && data.users.length > 0) {
                allUsers = allUsers.concat(data.users);
                page++;
                if (data.users.length < 1000) hasMore = false;
            } else {
                hasMore = false;
            }
        }
        fs.writeFileSync('backup_supabase_auth_users.json', JSON.stringify(allUsers, null, 2));
        console.log(`✅ Saved ${allUsers.length} Supabase users to backup_supabase_auth_users.json`);
    } catch (e) {
        console.error("Error backing up Supabase Auth:", e);
    }

    // 2. RESEND CONTACTS
    try {
        console.log("Fetching Resend Audiences and Contacts...");
        const resendKey = process.env.RESEND_API_KEY;
        if (!resendKey) {
            console.log("No RESEND_API_KEY found in .env.local");
            return;
        }

        const audiencesRes = await fetch('https://api.resend.com/audiences', {
            headers: { 'Authorization': `Bearer ${resendKey}` }
        });
        const audiencesData = await audiencesRes.json();
        const audiences = audiencesData.data || [];
        
        let allContacts = {};
        for (const aud of audiences) {
            const contactsRes = await fetch(`https://api.resend.com/audiences/${aud.id}/contacts`, {
                headers: { 'Authorization': `Bearer ${resendKey}` }
            });
            const contactsData = await contactsRes.json();
            allContacts[aud.id] = {
                audience_info: aud,
                contacts: contactsData.data || []
            };
        }
        fs.writeFileSync('backup_resend_audiences_contacts.json', JSON.stringify({ audiences, allContacts }, null, 2));
        console.log(`✅ Saved Resend data to backup_resend_audiences_contacts.json`);

    } catch (e) {
        console.error("Error backing up Resend:", e);
    }
}

backupExternal();
