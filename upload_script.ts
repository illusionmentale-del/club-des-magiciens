import process from "process";
import fs from "fs";
import { createClient } from "@supabase/supabase-js";

// Load manual env
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function uploadFile() {
    const filePath = "/Users/jeremymarouani/.gemini/antigravity/brain/378dd897-ce6b-45e6-85ea-dc6ed8632b4e/wizard_girl_caucasian_1776895964383.png";
    const fileBuffer = fs.readFileSync(filePath);
    
    console.log("Uploading file...");
    const { data, error } = await supabase.storage
        .from('avatars')
        .upload('skins/wizard_girl_caucasian_1776895964383.png', fileBuffer, {
            contentType: 'image/png',
            upsert: true
        });

    if (error) {
        console.error("Upload error:", error);
    } else {
        console.log("Upload success:", data);
    }
}

uploadFile();
