import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface ProviderApplicationEmailData {
  name: string;
  username: string;
  email: string;
  phone_number: string;
  city: string;
  description: string;
  profileImageUrl: string;
  idDocumentUrl: string;
  idDocumentType: string;
  approvalToken: string;
  services: Array<{
    name: string;
    price_estimate?: number;
    description?: string;
    category_id: number;
  }>;
}

export async function sendProviderApplicationEmail(
  adminEmail: string,
  data: ProviderApplicationEmailData
) {

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL
      ? `https://${process.env.NEXT_PUBLIC_BASE_URL}`
      : process.env.NEXT_PUBLIC_VERCEL_URL
        ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
        : "http://localhost:3001";

  const approveUrl = `${baseUrl}/api/approve-provider?token=${encodeURIComponent(data.approvalToken)}`;

  const servicesList = data.services
    .map(
      (s) => `
        <li style="margin-bottom: 12px; padding: 12px; background: #f9fafb; border-radius: 8px;">
          <strong>${s.name}</strong>
          ${s.price_estimate ? `<br>Price: Rs ${s.price_estimate}` : ""}
          ${s.description ? `<br>${s.description}` : ""}
        </li>
      `
    )
    .join("");

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Provider Application</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
        <div style="background-color: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h1 style="color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
            New Provider Application
          </h1>
          
          <h2 style="color: #374151; margin-top: 24px;">Provider Information</h2>
          <div style="background: #f9fafb; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Username:</strong> ${data.username}</p>
            <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
            <p><strong>Phone:</strong> <a href="tel:${data.phone_number}">${data.phone_number}</a></p>
            <p><strong>City:</strong> ${data.city}</p>
            <p><strong>Description:</strong></p>
            <p style="margin-left: 20px; font-style: italic;">${data.description}</p>
          </div>

          <h2 style="color: #374151; margin-top: 24px;">Profile Picture</h2>
          <div style="text-align: center; margin: 16px 0;">
            <img 
              src="${data.profileImageUrl}" 
              alt="Profile Picture" 
              style="max-width: 300px; border-radius: 8px; border: 2px solid #e5e7eb;"
            />
          </div>

          <h2 style="color: #374151; margin-top: 24px;">ID Document</h2>
          <div style="text-align: center; margin: 16px 0;">
            ${
              data.idDocumentType === "application/pdf"
                ? `<a href="${data.idDocumentUrl}" target="_blank" style="display:inline-block; padding:12px 20px; background:#3b82f6; color:white; border-radius:6px; text-decoration:none; font-weight:bold;">View PDF</a>`
                : `<img src="${data.idDocumentUrl}" alt="ID Document" style="max-width:100%; border-radius:8px; border:2px solid #e5e7eb;" />`
            }
          </div>

          <h2 style="color: #374151; margin-top: 24px;">Services Offered</h2>
          <ul style="list-style: none; padding: 0;">
            ${servicesList}
          </ul>

          <div style="margin-top: 32px; text-align: center; padding: 24px; background: #eff6ff; border-radius: 8px;">
            <p style="margin-bottom: 16px; font-weight: 600;">Review and approve this application:</p>
            <a 
              href="${approveUrl}" 
              style="display: inline-block; background-color: #10b981; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"
            >
              Approve Provider
            </a>
          </div>

          <p style="margin-top: 24px; font-size: 12px; color: #6b7280; text-align: center;">
            This is an automated email. Please do not reply directly.
          </p>
        </div>
      </body>
    </html>
  `;

  try {
    const { data: emailData, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: [adminEmail],
      subject: `New Provider Application: ${data.name} (${data.username})`,
      html: htmlContent,
    });

    if (error) {
      throw error;
    }

    return { success: true, emailId: emailData?.id };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to send email:", errorMessage);
    throw new Error(`Email sending failed: ${errorMessage}`);
  }
}
