const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function run() {
    try {
        const sql = `
            DO $$
            BEGIN
                -- Drop first if they exist to avoid errors
                DROP POLICY IF EXISTS "Library Public Read" ON storage.objects;
                DROP POLICY IF EXISTS "Library Auth Upload" ON storage.objects;
                DROP POLICY IF EXISTS "Library Auth Update" ON storage.objects;
                DROP POLICY IF EXISTS "Library Auth Delete" ON storage.objects;

                -- Allow public read access
                CREATE POLICY "Library Public Read" 
                ON storage.objects FOR SELECT
                USING (bucket_id = 'library');

                -- Allow authenticated users to insert files
                CREATE POLICY "Library Auth Upload" 
                ON storage.objects FOR INSERT
                TO authenticated
                WITH CHECK (bucket_id = 'library');

                -- Allow authenticated users to update files
                CREATE POLICY "Library Auth Update" 
                ON storage.objects FOR UPDATE
                TO authenticated
                USING (bucket_id = 'library');

                -- Allow authenticated users to delete files
                CREATE POLICY "Library Auth Delete" 
                ON storage.objects FOR DELETE
                TO authenticated
                USING (bucket_id = 'library');
            END $$;
        `;

        console.log("Applying RLS policies to storage.objects for the 'library' bucket...");
        
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${supabaseKey}`,
                'apikey': supabaseKey
            },
            body: JSON.stringify({ query: sql })
        });
        
        const text = await response.text();
        console.log('Result:', text || 'Success (No output means it succeeded without returning rows)');
    } catch(e) {
        console.error("Error executing script:", e);
    }
}

run();
