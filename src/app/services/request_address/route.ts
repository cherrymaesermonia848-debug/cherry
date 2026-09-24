import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import supabase from "@/lib/supabase-server";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.APP_PASSWORD, // Gmail App Password, not the account password
  },
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { requested_by, address } = body ?? {};

    if (!requested_by || !address) {
      return NextResponse.json(
        {
          success: false,
          error: "requested_by and address are required",
        },
        { status: 400 }
      );
    }

    if (!EMAIL_RE.test(requested_by)) {
      return NextResponse.json(
        {
          success: false,
          error: "requested_by must be a valid email address",
        },
        { status: 400 }
      );
    }

    // 1. Insert the request into Supabase
    const { data, error } = await supabase
      .from("locations_resquest")
      .insert([{ requested_by, address, status: "pending" }])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        {
          success: false,
          error: error.message || "Failed to save request",
        },
        { status: 500 }
      );
    }

    // 2a. Notify the admin (fire-and-forget-safe: failure here doesn't roll
    //     back the DB write — the request is already saved)
    try {
      const info = await transporter.sendMail({
        from: `"Pontevedra Tourism" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        subject: `New location request — ${requested_by}`,
        priority: "high",
        headers: {
          Importance: "high",
          "X-Priority": "1",
          "X-MSMail-Priority": "High",
        },
        html: buildAdminEmailHtml({
          id: data.id,
          requested_by,
          address,
          created_at: data.created_at,
        }),
      });
      console.log("Admin email accepted:", info.accepted, info.rejected);
    } catch (mailErr) {
      console.error("Admin email failed (request was still saved):", mailErr);
    }

    // 2b. Confirm receipt to the requester (requested_by is their email)
    try {
      const info = await transporter.sendMail({
        from: `"Pontevedra Tourism" <${process.env.EMAIL_USER}>`,
        to: requested_by,
        subject: "We received your location request",
        html: buildRequesterEmailHtml({ requested_by, address }),
      });
      console.log("Requester email accepted:", info.accepted, info.rejected);
    } catch (mailErr) {
      console.error(
        "Requester confirmation email failed (request was still saved):",
        mailErr
      );
    }

    return NextResponse.json({ success: true, message: "Check Your Email", data }, { status: 201 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Something went wrong",
      },
      { status: 500 }
    );
  }
}

function buildAdminEmailHtml({
  id,
  requested_by,
  address,
  created_at,
}: {
  id: number;
  requested_by: string;
  address: string;
  created_at: string;
}) {
  const formattedDate = new Date(created_at).toLocaleString("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  /* eslint-disable no-secrets/no-secrets -- inline CSS in the email template, not a secret */
  return `
<!doctype html>
<html>
  <body style="margin:0;padding:0;background-color:#f4f6f5;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f5;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.06);">
            <!-- Header -->
            <tr>
              <td style="background-color:#0f766e;padding:28px 32px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="color:#ffffff;font-size:18px;font-weight:600;letter-spacing:0.2px;">
                      Pontevedra Tourism
                    </td>
                  </tr>
                  <tr>
                    <td style="color:#d1fae5;font-size:13px;padding-top:4px;">
                      New location request received
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:32px;">
                <p style="margin:0 0 20px 0;color:#374151;font-size:14px;line-height:1.6;">
                  A new location has been requested through the site. Details below:
                </p>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
                  <tr>
                    <td style="padding:14px 18px;background-color:#f9fafb;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.4px;width:130px;border-bottom:1px solid #e5e7eb;">
                      Requested by (email)
                    </td>
                    <td style="padding:14px 18px;color:#111827;font-size:14px;border-bottom:1px solid #e5e7eb;">
                      ${escapeHtml(requested_by)}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:14px 18px;background-color:#f9fafb;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.4px;border-bottom:1px solid #e5e7eb;">
                      Address
                    </td>
                    <td style="padding:14px 18px;color:#111827;font-size:14px;border-bottom:1px solid #e5e7eb;">
                      ${escapeHtml(address)}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:14px 18px;background-color:#f9fafb;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.4px;border-bottom:1px solid #e5e7eb;">
                      Status
                    </td>
                    <td style="padding:14px 18px;border-bottom:1px solid #e5e7eb;">
                      <span style="display:inline-block;background-color:#fef3c7;color:#92400e;font-size:12px;font-weight:600;padding:3px 10px;border-radius:999px;">
                        Pending
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:14px 18px;background-color:#f9fafb;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.4px;">
                      Submitted
                    </td>
                    <td style="padding:14px 18px;color:#111827;font-size:14px;">
                      ${formattedDate}
                    </td>
                  </tr>
                </table>

                <p style="margin:24px 0 0 0;color:#9ca3af;font-size:12px;">
                  Request ID #${id} · Review this in the admin panel to approve or reject.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:18px 32px;background-color:#f9fafb;border-top:1px solid #e5e7eb;">
                <p style="margin:0;color:#9ca3af;font-size:11px;text-align:center;">
                  This is an automated notification from the Pontevedra Tourism platform.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
  /* eslint-enable no-secrets/no-secrets */
}

function buildRequesterEmailHtml({
  requested_by,
  address,
}: {
  requested_by: string;
  address: string;
}) {
  /* eslint-disable no-secrets/no-secrets -- inline CSS in the email template, not a secret */
  return `
<!doctype html>
<html>
  <body style="margin:0;padding:0;background-color:#f4f6f5;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f5;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.06);">
            <!-- Header -->
            <tr>
              <td style="background-color:#0f766e;padding:28px 32px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="color:#ffffff;font-size:18px;font-weight:600;letter-spacing:0.2px;">
                      Pontevedra Tourism
                    </td>
                  </tr>
                  <tr>
                    <td style="color:#d1fae5;font-size:13px;padding-top:4px;">
                      Thanks for your submission
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:32px;">
                <p style="margin:0 0 16px 0;color:#374151;font-size:14px;line-height:1.6;">
                  Hi ${escapeHtml(requested_by)},
                </p>
                <p style="margin:0 0 20px 0;color:#374151;font-size:14px;line-height:1.6;">
                  We've received your request to add <strong>${escapeHtml(
                    address
                  )}</strong> to Pontevedra Tourism. Our team will review it shortly, and we'll follow up once it's been approved or if we need more details.
                </p>

                <span style="display:inline-block;background-color:#fef3c7;color:#92400e;font-size:12px;font-weight:600;padding:3px 10px;border-radius:999px;">
                  Pending review
                </span>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:18px 32px;background-color:#f9fafb;border-top:1px solid #e5e7eb;">
                <p style="margin:0;color:#9ca3af;font-size:11px;text-align:center;">
                  This is an automated confirmation from the Pontevedra Tourism platform. No action is needed right now.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
  /* eslint-enable no-secrets/no-secrets */
}

// Minimal HTML-escaping so user-submitted text can't break the email markup
function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}