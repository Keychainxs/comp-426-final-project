import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/utils/supabase/clients/server";
import { db } from "@/server/db/index";
import { profilesTable } from "@/server/db/schema";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  if (!code) return NextResponse.redirect(`${origin}/login`);

  // Trade the one-time code from Google for a session (sets the auth cookies).
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !data.user) return NextResponse.redirect(`${origin}/login`);

  // First Google sign-in: create the profile row. Later sign-ins skip this.
  const email = data.user.email ?? "";
  await db
    .insert(profilesTable)
    .values({
      id: data.user.id,
      name: data.user.user_metadata.full_name ?? email,
      handle: email.split("@")[0],
    })
    .onConflictDoNothing();

  return NextResponse.redirect(`${origin}/`);
}