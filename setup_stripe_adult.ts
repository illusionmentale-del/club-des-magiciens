import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!STRIPE_SECRET_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing required environment variables.");
  process.exit(1);
}

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia' as any
});

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  try {
    console.log("1. Creating L'Atelier des Magiciens Stripe Product...");
    
    // Create stripe product
    const product = await stripe.products.create({
      name: "Le Cercle (Accès Atelier)",
      description: "Abonnement mensuel à l'Atelier des Magiciens",
      metadata: {
        space: "adults"
      }
    });

    console.log(`Product created: ${product.id}`);

    console.log("2. Creating Stripe Price (4.99€ / month)...");
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: 499, // 4.99 EUR in cents
      currency: 'eur',
      recurring: {
        interval: 'month'
      }
    });

    console.log(`Price created: ${price.id}`);

    console.log("3. Upserting into Supabase 'products' table...");

    const { data, error } = await supabase.from('products').upsert({
      id: "prod_atelier_mensuel_499",
      stripe_product_id: product.id,
      stripe_price_id: price.id,
      title: "Pass Mensuel",
      description: "Accès intégral à l'Atelier",
      price: 4.99,
      price_label: "4,99€",
      type: "subscription",
      space: "adults",
      is_active: true
    }, { onConflict: 'id' });

    if (error) {
      console.error("Supabase Error:", error);
      throw error;
    }

    console.log("Success! Adult subscription is provisioned.");
    
  } catch (err) {
    console.error("Fatal Error:", err);
  }
}

run();
