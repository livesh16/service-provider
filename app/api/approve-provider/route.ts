import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const token = searchParams.get("token");

    if (!token) {
      const errorHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Missing Token</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                margin: 0;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: #333;
              }
              .container {
                background: white;
                border-radius: 12px;
                padding: 40px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                text-align: center;
                max-width: 500px;
              }
              h1 { color: #ef4444; margin-bottom: 16px; }
              p { color: #6b7280; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>❌ Missing Token</h1>
              <p>Approval token is required.</p>
            </div>
          </body>
        </html>
      `;
      return new NextResponse(errorHtml, {
        status: 400,
        headers: { "Content-Type": "text/html" },
      });
    }

    // Hash the token the same way it was hashed during creation
    const tokenHash = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(token)
    );

    const tokenHashHex = Array.from(new Uint8Array(tokenHash))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    // Find the application with this token hash
    const { data: application, error: appError } = await supabaseServer
      .from("provider_applications")
      .select("*")
      .eq("approval_token_hash", tokenHashHex)
      .single();

    if (appError || !application) {
      const errorHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Invalid Token</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                margin: 0;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: #333;
              }
              .container {
                background: white;
                border-radius: 12px;
                padding: 40px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                text-align: center;
                max-width: 500px;
              }
              h1 { color: #ef4444; margin-bottom: 16px; }
              p { color: #6b7280; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>❌ Invalid Token</h1>
              <p>This approval link is invalid or has expired.</p>
            </div>
          </body>
        </html>
      `;
      return new NextResponse(errorHtml, {
        status: 404,
        headers: { "Content-Type": "text/html" },
      });
    }

    // Check if already approved
    if (application.approved) {
      const alreadyApprovedHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Already Approved</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                margin: 0;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: #333;
              }
              .container {
                background: white;
                border-radius: 12px;
                padding: 40px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                text-align: center;
                max-width: 500px;
              }
              h1 { color: #f59e0b; margin-bottom: 16px; }
              p { color: #6b7280; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>⚠️ Already Approved</h1>
              <p>This application has already been approved.</p>
            </div>
          </body>
        </html>
      `;
      return new NextResponse(alreadyApprovedHtml, {
        status: 400,
        headers: { "Content-Type": "text/html" },
      });
    }

    // Get the services for this application
    const { data: applicationServices, error: servicesError } =
      await supabaseServer
        .from("provider_application_services")
        .select("*")
        .eq("application_id", application.id);

    if (servicesError) {
      throw servicesError;
    }

    // Insert provider into providers table
    const { data: provider, error: providerError } = await supabaseServer
      .from("providers")
      .insert({
        name: application.name,
        username: application.username,
        phone_number: application.phone_number,
        city: application.city,
        description: application.description,
        image_url: application.image_url,
        verified: true, // Approved providers are verified
      })
      .select()
      .single();

    if (providerError) {
      // Check if it's a unique constraint violation (username or email already exists)
      if (providerError.code === "23505") {
        const conflictHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Conflict</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  min-height: 100vh;
                  margin: 0;
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  color: #333;
                }
                .container {
                  background: white;
                  border-radius: 12px;
                  padding: 40px;
                  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                  text-align: center;
                  max-width: 500px;
                }
                h1 { color: #ef4444; margin-bottom: 16px; }
                p { color: #6b7280; }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>❌ Approval Failed</h1>
                <p>A provider with this username already exists. Application cannot be approved.</p>
              </div>
            </body>
          </html>
        `;
        return new NextResponse(conflictHtml, {
          status: 409,
          headers: { "Content-Type": "text/html" },
        });
      }
      throw providerError;
    }

    // Insert services into services table
    if (applicationServices && applicationServices.length > 0) {
      const servicesToInsert = applicationServices.map((s) => ({
        provider_id: provider.id,
        name: s.name,
        price_estimate: s.price_estimate ?? null,
        description: s.description ?? null,
        category_id: s.category_id,
      }));

      const { error: insertServicesError } = await supabaseServer
        .from("services")
        .insert(servicesToInsert);

      if (insertServicesError) {
        // If services insertion fails, we should ideally rollback the provider insertion
        // For now, we'll just log it and mark as approved
        console.error("Failed to insert services:", insertServicesError);
      }
    }

    // Mark application as approved
    const { error: updateError } = await supabaseServer
      .from("provider_applications")
      .update({ approved: true, approved_at: new Date().toISOString() })
      .eq("id", application.id);

    if (updateError) {
      console.error("Failed to mark application as approved:", updateError);
      // Don't fail the request, as the provider has already been created
    }

    // Return HTML success page
    const htmlResponse = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Provider Approved</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: #333;
            }
            .container {
              background: white;
              border-radius: 12px;
              padding: 40px;
              box-shadow: 0 10px 40px rgba(0,0,0,0.2);
              text-align: center;
              max-width: 500px;
            }
            h1 {
              color: #10b981;
              margin-bottom: 16px;
            }
            p {
              color: #6b7280;
              line-height: 1.6;
            }
            .provider-info {
              background: #f9fafb;
              padding: 16px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .provider-name {
              font-weight: bold;
              color: #1f2937;
              font-size: 1.2em;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>✅ Provider Approved Successfully!</h1>
            <p>The provider has been approved and added to the system.</p>
            <div class="provider-info">
              <p class="provider-name">${provider.name}</p>
              <p>Username: ${provider.username}</p>
            </div>
            <p>You can close this page.</p>
          </div>
        </body>
      </html>
    `;

    return new NextResponse(htmlResponse, {
      status: 200,
      headers: { "Content-Type": "text/html" },
    });
  } catch (err: unknown) {
    console.error("Approval error:", err);
    const errorMessage = err instanceof Error ? err.message : "Failed to approve provider. Please try again later.";
    const errorHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Error</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: #333;
            }
            .container {
              background: white;
              border-radius: 12px;
              padding: 40px;
              box-shadow: 0 10px 40px rgba(0,0,0,0.2);
              text-align: center;
              max-width: 500px;
            }
            h1 { color: #ef4444; margin-bottom: 16px; }
            p { color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>❌ Error</h1>
            <p>${errorMessage}</p>
          </div>
        </body>
      </html>
    `;
    return new NextResponse(errorHtml, {
      status: 500,
      headers: { "Content-Type": "text/html" },
    });
  }
}
