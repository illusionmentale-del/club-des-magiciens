#!/bin/bash
source .env.local

echo "Mise à jour des Noctalis (price_xp: 200, is_default: false)..."
curl -s -X PATCH "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/avatar_skins?name=like.*Noctali*" \
  -H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=minimal" \
  -d '{
    "price_xp": 200,
    "is_default": false
  }' > /dev/null

echo "Insertion des Emblèmes de Grade comme Avatars gratuits..."

read -r -d '' DATA << EOM
/achievements/magic_shield.png|Emblème: Apprenti
/achievements/quest_hat.png|Emblème: Magicien
/achievements/quest_book.png|Emblème: Élève Prodige
/achievements/quest_hourglass.png|Emblème: Curieux
/achievements/quest_scroll.png|Emblème: Gardien Millénaire
EOM

echo "$DATA" | while IFS="|" read -r url name; do
  if [ -z "$url" ]; then continue; fi
  
  echo "Ajout $name..."
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
done

echo "Terminé !"
