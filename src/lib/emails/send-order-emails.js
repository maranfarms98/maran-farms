import "server-only";
import { Resend } from "resend";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";
import { adminOrderEmail, customerOrderEmail } from "@/lib/emails/templates";

function getFrom() {
  return (
    process.env.EMAIL_FROM?.trim() ||
    `${SITE_NAME} <${CONTACT_EMAIL}>`
  );
}

/**
 * Send customer receipt (if email present) + admin notification after a website
 * order is marked paid. Phone orders are skipped. Never throws — failures are logged only.
 */
export async function sendOrderPaidEmails(order) {
  if (order.origin === "phone") return;

  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.warn("[sendOrderPaidEmails] RESEND_API_KEY not set — skipping");
    return;
  }

  const notifyTo = process.env.ORDER_NOTIFY_EMAIL?.trim();
  if (!notifyTo) {
    console.warn("[sendOrderPaidEmails] ORDER_NOTIFY_EMAIL not set — skipping admin email");
  }

  const resend = new Resend(apiKey);
  const from = getFrom();
  const siteUrl = process.env.SITE_URL?.trim() || null;
  const tasks = [];

  if (order.email) {
    const customer = customerOrderEmail(order, { siteUrl });
    tasks.push(
      resend.emails
        .send({
          from,
          to: order.email,
          replyTo: CONTACT_EMAIL,
          subject: customer.subject,
          html: customer.html,
        })
        .then(({ error }) => {
          if (error) console.error("[sendOrderPaidEmails] customer", error);
        })
        .catch((err) => console.error("[sendOrderPaidEmails] customer", err)),
    );
  }

  if (notifyTo) {
    const admin = adminOrderEmail(order, { siteUrl });
    tasks.push(
      resend.emails
        .send({
          from,
          to: notifyTo,
          subject: admin.subject,
          html: admin.html,
        })
        .then(({ error }) => {
          if (error) console.error("[sendOrderPaidEmails] admin", error);
        })
        .catch((err) => console.error("[sendOrderPaidEmails] admin", err)),
    );
  }

  await Promise.allSettled(tasks);
}
