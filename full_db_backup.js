const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Derived from schema files
const TABLES = [
    'profiles',
    'courses',
    'videos',
    'enrollments',
    'library_items',
    'library_tags',
    'library_item_tags',
    'user_library_progress',
    'kids_masterclass_settings',
    'kids_video_progress',
    'user_progress',
    'legal_pages',
    'products',
    'instagram_posts',
    'event_reminders',
    'user_purchases',
    'live_messages',
    'lives',
    'subscriptions',
    'badges',
    'user_badges',
    'comments',
    'news',
    'settings',
    'global_alerts',
    'user_alerts_read',
    'course_likes',
    'course_comments'
];

async function backupDB() {
    console.log("Starting full database backup...");
    const backupData = {};
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `db_backup_${timestamp}.json`;

    for (const table of TABLES) {
        process.stdout.write(`Fetching table: ${table}... `);
        
        let allData = [];
        let hasMore = true;
        let pagedRange = 0;
        const pageSize = 1000;

        while(hasMore) {
            const { data, error } = await supabase
                .from(table)
                .select('*')
                .range(pagedRange * pageSize, (pagedRange + 1) * pageSize - 1);
                
            if (error) {
                // If the table doesn't exist or is empty, it might throw an error or just return empty
                process.stdout.write(`ERROR: ${error.message}\n`);
                hasMore = false;
                if (!backupData[table]) backupData[table] = []; // Initialize empty
            } else {
                if (data && data.length > 0) {
                    allData = allData.concat(data);
                    pagedRange++;
                    if (data.length < pageSize) {
                        hasMore = false;
                    }
                } else {
                    hasMore = false;
                }
            }
        }
        
        if (allData.length > 0 || !backupData[table]) {
            backupData[table] = allData;
            process.stdout.write(`OK (${allData.length} rows)\n`);
        }
    }

    const filepath = path.join(__dirname, filename);
    fs.writeFileSync(filepath, JSON.stringify(backupData, null, 2));
    console.log(`\n✅ Backup completed successfully! Saved to: ${filepath}`);
    console.log(`File size: ${(fs.statSync(filepath).size / (1024*1024)).toFixed(2)} MB`);
}

backupDB();
