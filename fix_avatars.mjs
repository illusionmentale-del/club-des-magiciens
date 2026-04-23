import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false }
});

const fileMappings = [
    { file: 'wizard_girl_caucasian_1776895964383.png', name: 'Magicienne Stellaire' },
    { file: 'wizard_boy_dark_skin_1776895984784.png', name: 'Le Maître des Runes' },
    { file: 'wizard_girl_asian_1776896005282.png', name: 'L\'Invocatrice Florale' },
    { file: 'wizard_androgynous_1776896848288.png', name: "L'Illusionniste Cosmique" },
    { file: 'wizard_cat_powerful_1776896952615.png', name: 'Le Chat Archimage' },
    { file: 'wizard_puppy_cute_1776897069528.png', name: 'Le Chiot Thaumaturge' },
    { file: 'wizard_owl_cute_1776897084768.png', name: 'Le Hibou Céleste' },
    { file: 'wizard_bunny_cute_1776897098189.png', name: 'Le Lapin Lunaire' },
    { file: 'wizard_boy_redhead_1776897110443.png', name: 'Le Sorcier Élémentaire' },
    { file: 'wizard_girl_black_braids_1776897123191.png', name: 'La Gardienne Éternelle' },
    { file: 'wizard_noctali_1776897446707.png', name: 'Nox, Reine des Ombres' },
    { file: 'wizard_noctali_celestial_1776897580836.png', name: 'Nox, le Vide Céleste' },
    { file: 'wizard_noctali_apprentice_1776897592805.png', name: "Nox, l'Enchantresse" },
    { file: 'wizard_noctali_nature_1776897604618.png', name: 'Nox, Fléau de la Nature' },
    { file: 'wizard_noctali_alchemist_1776897880264.png', name: "Nox, l'Alchimiste Royale" },
    { file: 'wizard_noctali_time_1776897895920.png', name: 'Nox, Gardienne du Temps' },
    { file: 'wizard_noctali_knight_1776897911156.png', name: 'Nox, Chevalier Noir' },
    { file: 'wizard_noctali_spooky_1776897927564.png', name: 'Nox, la Mystique' },
];

const dirStr = "/Users/jeremymarouani/.gemini/antigravity/brain/378dd897-ce6b-45e6-85ea-dc6ed8632b4e";

async function run() {
    for (const item of fileMappings) {
        if (!item.name.includes("Nox")) continue;
        const urlMatch = `%${item.file}%`;
        const { error: dbError } = await supabase
            .from("avatar_skins")
            .update({ name: item.name })
            .like("image_url", urlMatch);
            
        if (dbError) console.error(`DB Error for ${item.file}: ${dbError.message}`);
        else console.log(`Renamed DB entry for ${item.name}`);

        // Upload File
        const filePath = path.join(dirStr, item.file);
        if (fs.existsSync(filePath)) {
            const buffer = fs.readFileSync(filePath);
            
            const { data, error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(`skins/${item.file}`, buffer, {
                    contentType: 'image/png',
                    upsert: true
                });
                
            if (uploadError) console.error(`Upload Failed for ${item.file}:`, uploadError);
            else console.log(`Uploaded correctly: ${item.file}`);
        } else {
            console.error(`File missing locally: ${filePath}`);
        }
    }
}

run();
