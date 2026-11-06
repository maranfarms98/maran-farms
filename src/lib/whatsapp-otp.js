import { toWhatsAppE164 } from "@/lib/phone";

const GRAPH_API_VERSION = "v23.0";

/**
 * Returns true when Meta Cloud API credentials for OTP delivery are present.
 * Without these, send-otp returns an error and does not deliver a code.
 */
export function isWhatsAppOtpConfigured() {
  return Boolean(
    process.env.WHATSAPP_TOKEN?.trim() &&
      process.env.WHATSAPP_PHONE_NUMBER_ID?.trim() &&
      process.env.WHATSAPP_OTP_TEMPLATE?.trim(),
  );
}

/**
 * Sends a Meta authentication (OTP) template via WhatsApp Cloud API.
 * @see https://developers.facebook.com/documentation/business-messaging/whatsapp/templates/authentication-templates/authentication-templates
 *
 * @param {{ phone: string, otp: string }} params
 *   `phone` — 10-digit Indian mobile (no country code)
 *   `otp` — verification code to embed in the template
 */
export async function sendWhatsAppOtp({ phone, otp }) {
  const token = process.env.WHATSAPP_TOKEN?.trim();
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID?.trim();
  const templateName = process.env.WHATSAPP_OTP_TEMPLATE?.trim();
  const language =
    process.env.WHATSAPP_OTP_TEMPLATE_LANG?.trim() || "en";

  if (!token || !phoneNumberId || !templateName) {
    throw new Error("WhatsApp OTP is not configured");
  }

  const to = toWhatsAppE164(phone);
  const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${phoneNumberId}/messages`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to,
      type: "template",
      template: {
        name: templateName,
        language: { code: language },
        components: [
          {
            type: "body",
            parameters: [{ type: "text", text: otp }],
          },
          {
            type: "button",
            sub_type: "url",
            index: "0",
            parameters: [{ type: "text", text: otp }],
          },
        ],
      },
    }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const detail =
      data?.error?.message ||
      data?.error?.error_user_msg ||
      `HTTP ${res.status}`;
    console.error("[whatsapp-otp]", detail, data?.error?.code);
    throw new Error(detail);
  }

  return data;
}
