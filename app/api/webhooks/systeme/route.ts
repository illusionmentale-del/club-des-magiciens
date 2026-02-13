import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Initialize Supabase Admin Client (Service Role)
// We need this to bypass RLS and manage users
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    // DEBUG: Log payload to Supabase
    await supabaseAdmin.from("webhook_logs").insert({
      payload: payload
    });

    // Systeme.io payload usually contains 'data' object with 'contact'
    const email = payload.data?.customer?.email || payload.data?.contact?.email || payload.email || payload.contact?.email;

    if (!email) {
      await supabaseAdmin.from("webhook_logs").insert({ payload: { error: "No email found", received: payload } });
      return NextResponse.json({ error: "No email found in payload" }, { status: 400 });
    }

    // Check if user exists
    const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers();
    const userExists = existingUser.users.find((u) => u.email === email);

    if (userExists) {
      console.log(`User ${email} already exists.`);
      await supabaseAdmin.from("webhook_logs").insert({ payload: { status: "User already exists", email } });
      return NextResponse.json({ message: "User already exists", userId: userExists.id });
    }

    // Invite User via Supabase Native Email (Magic Link)
    const { data: newUser, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email);

    if (inviteError) {
      console.error("Error inviting user:", inviteError);
      await supabaseAdmin.from("webhook_logs").insert({ payload: { error: inviteError.message, email } });
      return NextResponse.json({ error: inviteError.message }, { status: 500 });
    }

    console.log(`User ${email} invited successfully.`);
    await supabaseAdmin.from("webhook_logs").insert({ payload: { status: "User invited successfully", email, userId: newUser.user.id } });
    return NextResponse.json({ message: "User invited successfully", userId: newUser.user.id });

  } catch (error: any) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
