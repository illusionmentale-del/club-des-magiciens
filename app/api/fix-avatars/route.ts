import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import fs from "fs";
import path from "path";

export async function GET() {
    const supabase = createAdminClient();
    let logs: string[] = [];

    const fileMappings = [
        { file: 'wizard_girl_caucasian_1776895964383.png', name: 'Magicienne Stellaire' },
        { file: 'wizard_boy_dark_skin_1776895984784.png', name: 'Maître des Runes' },
        { file: 'wizard_girl_asian_1776896005282.png', name: 'Invocatrice Florale' },
        { file: 'wizard_androgynous_1776896848288.png', name: "L'Énigme Magique" },
        { file: 'wizard_cat_powerful_1776896952615.png', name: 'Le Chat Archimage' },
        { file: 'wizard_puppy_cute_1776897069528.png', name: 'Le Chiot Thaumaturge' },
        { file: 'wizard_owl_cute_1776897084768.png', name: 'Le Hibou Céleste' },
        { file: 'wizard_bunny_cute_1776897098189.png', name: 'Le Lapin Lunaire' },
        { file: 'wizard_boy_redhead_1776897110443.png', name: 'Le Sorcier Élémentaire' },
        { file: 'wizard_girl_black_braids_1776897123191.png', name: 'La Gardienne Éternelle' },
        { file: 'wizard_noctali_1776897446707.png', name: 'Noctali, Reine des Ombres' },
        { file: 'wizard_noctali_celestial_1776897580836.png', name: 'Noctali, le Vide Céleste' },
        { file: 'wizard_noctali_apprentice_1776897592805.png', name: "Noctali, l'Enchantresse" },
        { file: 'wizard_noctali_nature_1776897604618.png', name: 'Noctali, Fléau de la Nature' },
        { file: 'wizard_noctali_alchemist_1776897880264.png', name: "Noctali, l'Alchimiste Royale" },
        { file: 'wizard_noctali_time_1776897895920.png', name: 'Noctali, Gardienne du Temps' },
        { file: 'wizard_noctali_knight_1776897911156.png', name: 'Noctali, Chevalier Noir' },
        { file: 'wizard_noctali_spooky_1776897927564.png', name: 'Noctali, Nécromancienne' },
    ];

    const dirStr = "/Users/jeremymarouani/.gemini/antigravity/brain/378dd897-ce6b-45e6-85ea-dc6ed8632b4e";

    try {
        for (const item of fileMappings) {
            // Fix Name in DB
            const urlMatch = `%${item.file}%`;
            const { error: dbError } = await supabase
                .from("avatar_skins")
                .update({ name: item.name }) // rename gracefully!
                .like("image_url", urlMatch);
                
            if (dbError) logs.push(`DB Error for ${item.file}: ${dbError.message}`);
            else logs.push(`Renamed DB entry for ${item.name}`);

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
                    
                if (uploadError) logs.push(`Upload Failed for ${item.file}: ${uploadError.message}`);
                else logs.push(`Uploaded correctly: ${item.file}`);
            } else {
                logs.push(`File missing locally: ${filePath}`);
            }
        }
        
        return NextResponse.json({ success: true, logs });
    } catch (err: any) {
         return NextResponse.json({ success: false, error: err.message, logs });
    }
}
