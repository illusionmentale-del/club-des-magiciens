#!/bin/bash
source .env.local

DIR="/Users/jeremymarouani/.gemini/antigravity/brain/378dd897-ce6b-45e6-85ea-dc6ed8632b4e"

read -r -d '' DATA << EOM
wizard_noctali_alchemist_1776897880264.png|Noctali, l'Alchimiste Royale
wizard_noctali_time_1776897895920.png|Noctali, Gardienne du Temps
wizard_noctali_knight_1776897911156.png|Noctali, le Chevalier Noir
wizard_noctali_spooky_1776897927564.png|Noctali, la Nécromancienne Mignonne
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
