import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  // 1. Verify the secret token
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  if (secret !== process.env.SYSTEME_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 2. Parse the body
    const body = await request.json();
    const email = body.email; // Adapt this based on actual Systeme.io payload

    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const supabaseAdmin = createAdminClient();

    // 3. Check if user exists, or create them
    let userId;

    // Try to create the user with a random password (they will use magic link anyway)
    // We verify their email automatically since they paid.
    // Note: We use a random password placeholder.
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      email_confirm: true,
      user_metadata: { source: 'systeme_io' }
    });

    if (createError) {
      // If error is "User already registered", we need to find their ID.
      // We can query the public profiles table which should verify existence.
      if (createError.message.includes("already registered") || createError.status === 422) {
        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('id')
          .eq('email', email)
          .single();

        if (profile) {
          userId = profile.id;
        } else {
          console.error("User exists in Auth but not in Profiles?", email);
          return NextResponse.json({ error: "User state inconsistency" }, { status: 500 });
        }
      } else {
        throw createError;
      }
    } else {
      userId = newUser.user.id;
    }

    // 4. Enroll them in the course
    // We get the course ID for "Mentalisme Pro"
    const { data: course } = await supabaseAdmin
      .from('courses')
      .select('id')
      .ilike('title', 'Mentalisme Pro')
      .single();

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 500 });
    }

    // Insert enrollment
    const { error: enrollmentError } = await supabaseAdmin
      .from('enrollments')
      .insert({
        user_id: userId,
        course_id: course.id,
        purchased_at: new Date().toISOString()
      })
      .select()
      .single();

    // Ignore "duplicate key" error if they are already enrolled
    if (enrollmentError && !enrollmentError.code?.includes("23505")) { // 23505 is unique violation
      throw enrollmentError;
    }

    return NextResponse.json({ success: true, userId, enrolled: true });

  } catch (error: any) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
