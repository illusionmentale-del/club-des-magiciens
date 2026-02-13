import { createClient } from '@supabase/supabase-js'
// dotenv removed

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function main() {
    console.log("Checking courses...")
    const { data: courses, error } = await supabase.from('courses').select('*');
    if (error) {
        console.error('Error fetching courses:', error);
    } else {
        console.log('Found courses:', courses);
    }
}

main();
