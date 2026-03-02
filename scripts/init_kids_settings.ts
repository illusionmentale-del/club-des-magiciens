import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing Supabase credentials in .env.local");
    process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function initKidsSettings() {
    console.log("Initializing Kids menu settings in the database...");

    const settingsToInsert = [
        { key: 'enable_kids_program', value: 'true', label: 'Activer la formation (Kids)' },
        { key: 'enable_kids_masterclass', value: 'true', label: 'Activer les masterclass (Kids)' },
        { key: 'enable_kids_account', value: 'true', label: 'Activer Mes Informations (Kids)' },
        { key: 'enable_kids_shop', value: 'true', label: 'Activer la Boutique (Kids)' }
    ];

    try {
        for (const setting of settingsToInsert) {
            const { error } = await supabaseAdmin
                .from('settings')
                .upsert(setting, { onConflict: 'key' });

            if (error) {
                console.error(`Failed to insert ${setting.key}:`, error);
            } else {
                console.log(`Successfully initialized: ${setting.key}`);
            }
        }
        console.log("Database initialization complete.");
    } catch (e) {
        console.error("Error during init:", e);
    }
}

initKidsSettings();
