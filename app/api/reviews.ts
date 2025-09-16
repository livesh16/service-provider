import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { getServerSession } from "next-auth/next";
  import { authOptions } from "../api/auth/[...nextauth]/route"; // points to your NextAuth config

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  console.log("entered backend api")
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const body = await req.json();
  const { providerId, rating, comment } = body;

  console.log("saving reviews in ddb: ", body);

  // Insert review securely with service role key
  const { data, error } = await supabaseServer.from("reviews").insert({
    provider_id: providerId,
    user_id: session?.user.id,
    user_name: session?.user.name || "Anonymous",
    rating,
    comment,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data }, { status: 200 });
}
