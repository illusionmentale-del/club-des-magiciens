#!/bin/bash
source .env.local

DIR="/Users/jeremymarouani/.gemini/antigravity/brain/378dd897-ce6b-45e6-85ea-dc6ed8632b4e"

read -r -d '' DATA << EOM
wizard_girl_caucasian_1776895964383.png|Fille (Normale)
wizard_boy_dark_skin_1776895984784.png|Garçon (Cheveux bouclés)
wizard_girl_asian_1776896005282.png|Fille (Asiatique)
wizard_androgynous_1776896848288.png|L'Illusionniste
wizard_cat_powerful_1776896952615.png|Le Chat Archimage
wizard_puppy_cute_1776897069528.png|Le Chiot Thaumaturge
wizard_owl_cute_1776897084768.png|Le Hibou Céleste
wizard_bunny_cute_1776897098189.png|Le Lapin Lunaire
wizard_boy_redhead_1776897110443.png|Garçon (Roux)
wizard_girl_black_braids_1776897123191.png|Fille (Tresses)
EOM

echo "$DATA" | while IFS="|" read -r file name; do
  if [ -z "$file" ]; then continue; fi
  
  filepath="$DIR/$file"
  echo "Uploading $name ($file)..."
  
  curl -s -X POST "${NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/avatars/skins/$file" \
    -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
    -H "Content-Type: image/png" \
    --data-binary "@$filepath" > /dev/null
    
  echo "  --> Storage Upload Done."
  
  url="${NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/skins/$file"
  
  curl -s -X POST "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/avatar_skins" \
    -H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
    -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
    -H "Content-Type: application/json" \
    -H "Prefer: return=minimal" \
    -d '{
      "name": "'"$name"'",
      "image_url": "'"$url"'",
      "price_xp": 0,
      "is_default": true,
      "target_audience": "kids"
    }' > /dev/null
    
  echo "  --> DB Insert Done."
done

echo "Toutes les images ont été uploadees et inserees dans la DB !"
