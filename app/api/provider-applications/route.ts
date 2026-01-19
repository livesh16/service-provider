import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { sendProviderApplicationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // Extract fields
    const name = formData.get("name") as string;
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const phone_number = formData.get("phone_number") as string;
    const city = formData.get("city") as string;
    const description = formData.get("description") as string;
    const servicesJson = formData.get("services") as string; // JSON string of services

    const profileImageFile = formData.get("profileImage") as File;
    const idDocumentFile = formData.get("idDocument") as File;

    // 1️⃣ Generate approval token + hash
    // Generate a secure, random one-time token that will be sent to the admin
    // in the approval email link (e.g. ?token=XYZ).
    // This token should NEVER be stored directly in the database.
    const approvalToken = crypto.randomUUID();

    // Hash the approval token using SHA-256.
    // We store ONLY the hashed version in the database for security,
    // so even if the DB is leaked, the approval link cannot be forged.
    const approvalTokenHash = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(approvalToken)
    );

    // Convert the binary SHA-256 hash into a hexadecimal string
    // so it can be safely stored and compared in the database.
    const tokenHash = Array.from(new Uint8Array(approvalTokenHash))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    // 2️⃣ Upload files to Storage
    const profilePath = `profiles/${username}-${Date.now()}`;
    const idPath = `ids/${username}-${Date.now()}`;

    let { error: uploadProfileErr } = await supabaseServer.storage
      .from("provider-profile-images")
      .upload(profilePath, profileImageFile);

    if (uploadProfileErr) throw uploadProfileErr;

    let { error: uploadIdErr } = await supabaseServer.storage
      .from("provider-id-documents")
      .upload(idPath, idDocumentFile);

    if (uploadIdErr) throw uploadIdErr;

    // Get public URLs for the uploaded images
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const profileImageUrl = `${supabaseUrl}/storage/v1/object/public/provider-profile-images/${profilePath}`;
    const idDocumentUrl = `${supabaseUrl}/storage/v1/object/public/provider-id-documents/${idPath}`;

    // 3️⃣ Insert application
    const { data: application, error: appErr } = await supabaseServer
      .from("provider_applications")
      .insert({
        name,
        username,
        email,
        phone_number,
        city,
        description,
        image_url: profileImageUrl,  // Store full URL instead of path
        id_document_url: idDocumentUrl,  // Store full URL instead of path
        approval_token_hash: tokenHash,
      })
      .select()
      .single();

    if (appErr) throw appErr;

    // 4️⃣ Insert services
    const services = JSON.parse(servicesJson) as {
      name: string;
      price_estimate: number;
      description?: string;
      category_id: number;
    }[];

    if (services.length > 0) {
      const { error: servicesErr } = await supabaseServer
        .from("provider_application_services")
        .insert(
          services.map((s) => ({
            application_id: application.id,
            name: s.name,
            price_estimate: s.price_estimate ?? null,
            description: s.description ?? null,
            category_id: s.category_id
          }))
        );

      if (servicesErr) throw servicesErr;
    }

    // 5️⃣ Send email to admin
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      console.warn("ADMIN_EMAIL not configured. Skipping email notification.");
    } else {
      try {
        await sendProviderApplicationEmail(adminEmail, {
          name,
          username,
          email,
          phone_number,
          city,
          description,
          profileImageUrl,
          idDocumentUrl,
          approvalToken,
          services,
        });
      } catch (emailError: any) {
        // Log email error but don't fail the application submission
        console.error("Failed to send approval email:", emailError);
        // Optionally, you could store this error or retry later
      }
    }

    return NextResponse.json(
      { message: "Application submitted", approvalToken },
      { status: 200 }
    );
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Something went wrong" },
      { status: 400 }
    );
  }
}
