import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import supabase from "@/lib/supabase-server";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.APP_PASSWORD,
  },
});

const VALID_STATUSES = ["pending", "accepted", "declined"] as const;

export async function POST(req: Request) {
  try {
    const { id, status } = await req.json();

    if (!Number.isInteger(id)) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: `status must be one of: ${VALID_STATUSES.join(", ")}` },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("locations_resquest")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase update error:", error);
      return NextResponse.json(
        { error: "Failed to update request" },
        { status: 500 }
      );
    }

    // Notify the requester of the decision (requested_by is their email).
    // Failure here doesn't undo the status update — it's already saved.
    if (status === "accepted" || status === "declined") {
      try {
        const info = await transporter.sendMail({
          from: `"Pontevedra Tourism" <${process.env.EMAIL_USER}>`,
          to: data.requested_by,
          subject:
            status === "accepted"
              ? "Your location request was approved"
              : "Update on your location request",
          html: buildDecisionEmailHtml({
            address: data.address,
            status,
          }),
        });
        console.log("Decision email accepted:", info.accepted, info.rejected);
      } catch (mailErr) {
        console.error(
          "Decision email failed (status was still updated):",
          mailErr
        );
      }
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

function buildDecisionEmailHtml({
  address,
  status,
}: {
  address: string;
  status: "accepted" | "declined";
}) {
  const isAccepted = status === "accepted";
  const badgeColor = isAccepted
    ? "background-color:#d1fae5;color:#065f46;"
    : "background-color:#fee2e2;color:#991b1b;";
  const badgeText = isAccepted ? "Approved" : "Declined";
  const message = isAccepted
    ? `Good news — your request to add <strong>${escapeHtml(
        address
      )}</strong> to Pontevedra Tourism has been approved and is now live.`
    : `We've reviewed your request to add <strong>${escapeHtml(
        address
      )}</strong> to Pontevedra Tourism, and we're not able to move forward with it at this time.`;

  /* eslint-disable no-secrets/no-secrets -- inline CSS in the email template, not a secret */
  return `
<!doctype html>
<html>
  <body style="margin:0;padding:0;background-color:#f4f6f5;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f5;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.06);">
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
                      Update on your location request
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:32px;">
                <span style="display:inline-block;${badgeColor}font-size:12px;font-weight:600;padding:3px 10px;border-radius:999px;margin-bottom:16px;">
                  ${badgeText}
                </span>
                <p style="margin:0;color:#374151;font-size:14px;line-height:1.6;">
                  ${message}
                </p>
              </td>
            </tr>

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

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}