import { formatPrice, pluralizeUnit } from "@/lib/format";
import { PAYMENT_METHOD_LABELS } from "@/lib/orders/payment-methods";
import {
  CONTACT_EMAIL,
  INSTAGRAM_URL,
  SITE_NAME,
  WHATSAPP_DISPLAY,
  WHATSAPP_NUMBER,
} from "@/lib/site";

/** Brand tokens — match the new order confirmation email mock. */
const C = {
  green: "#183a1f",
  greenMid: "#4a8f4f",
  greenCheck: "#4caf50",
  greenSoft: "#eef5ec",
  greenText: "#3f7a43",
  cream: "#faf8f3",
  warm: "#f2efe6",
  ink: "#2a2f28",
  muted: "#8a8f83",
  border: "#e6e2d8",
  white: "#ffffff",
  softGray: "#eef0ea",
  softGrayIcon: "#9aa39a",
  link: "#2f6fdb",
  heroMuted: "#dcebda",
  tagline: "#a7d9ab",
  footerBar: "#cfe3cf",
};

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function shortId(orderId) {
  return String(orderId || "").slice(0, 8);
}

function itemSummary(items) {
  const first = items?.[0];
  if (!first?.name) return "";
  const extra = items.length > 1 ? ` + ${items.length - 1} more` : "";
  return `${first.name}${extra}`;
}

function formatOrderDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatShortDateTime(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDeliveryEstimate(iso, days = 2) {
  const base = iso ? new Date(iso) : new Date();
  const eta = new Date(base);
  eta.setDate(eta.getDate() + days);
  return eta.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatPhone(phone) {
  const digits = String(phone ?? "").replace(/\D/g, "").slice(-10);
  if (digits.length !== 10) return escapeHtml(phone);
  return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
}

function formatPhoneTel(phone) {
  const digits = String(phone ?? "").replace(/\D/g, "").slice(-10);
  if (digits.length !== 10) return String(phone ?? "");
  return `+91${digits}`;
}

function qtyLabel(item) {
  const qty = Number(item.quantity) || 0;
  const raw = String(item.unit || "unit").replace(/^per\s+/i, "").trim() || "unit";
  const unit = pluralizeUnit(raw, qty);
  return `${qty} ${unit}`;
}

function lineTotal(item) {
  const total = item.lineTotal ?? Number(item.price) * Number(item.quantity);
  return Number.isFinite(total) ? total : 0;
}

function subtotal(items) {
  return (items || []).reduce((sum, item) => sum + lineTotal(item), 0);
}

function itemCountLabel(items) {
  const count = (items || []).reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
  if (count <= 0) return "0 Items";
  return count === 1 ? "1 Item" : `${count} Items`;
}

function absUrl(siteUrl, path) {
  const base = (siteUrl || "").replace(/\/$/, "");
  if (!base) return path;
  if (path.startsWith("http")) return path;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

function paymentLabel(order) {
  return PAYMENT_METHOD_LABELS[order.payment_method] || order.payment_method || "—";
}

function whatsappUrl() {
  return `https://wa.me/${WHATSAPP_NUMBER}`;
}

function emailShell({ title, preheader, body }) {
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>${escapeHtml(title)}</title>
<!--[if mso]>
<noscript>
<xml>
<o:OfficeDocumentSettings>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml>
</noscript>
<style>
  table {border-collapse:collapse;}
  td,th,div,p,a,h1,h2,h3 {font-family: Arial, Helvetica, sans-serif;}
</style>
<![endif]-->
<style>
  body, table, td, a { -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
  table, td { mso-table-lspace:0pt; mso-table-rspace:0pt; border-collapse:collapse; }
  img { -ms-interpolation-mode:bicubic; border:0; outline:none; text-decoration:none; display:block; }
  body { margin:0; padding:0; width:100% !important; height:100% !important; background-color:${C.warm}; }
  a { text-decoration:none; }
  .summary-card { margin-top:-34px; }

  @media only screen and (max-width:620px) {
    .email-container { width:100% !important; max-width:100% !important; }
    .fluid { width:100% !important; max-width:100% !important; height:auto !important; }

    .px-mobile { padding-left:16px !important; padding-right:16px !important; }
    .hero-pad { padding:24px 16px 52px 16px !important; }
    .h1-mobile { font-size:22px !important; line-height:28px !important; }
    .brand-title { font-size:18px !important; letter-spacing:1px !important; }
    .card-pad { padding:16px !important; }
    .summary-wrap { padding-left:16px !important; padding-right:16px !important; }
    .summary-card { margin-top:-28px !important; }
    .summary-inner { padding:8px 4px !important; }

    /* KPI: neat 2×2 grid on mobile */
    .summary-cell {
      width:50% !important;
      max-width:50% !important;
      display:inline-block !important;
      box-sizing:border-box !important;
      vertical-align:top !important;
      border-right:none !important;
      border-bottom:1px solid ${C.border} !important;
      padding:14px 8px !important;
      text-align:center !important;
    }
    .summary-cell-last-row { border-bottom:none !important; }

    .stack { display:block !important; width:100% !important; max-width:100% !important; box-sizing:border-box !important; }
    .stack-pad { padding-left:0 !important; padding-right:0 !important; padding-top:14px !important; text-align:left !important; }
    .details-stack {
      display:block !important;
      width:100% !important;
      max-width:100% !important;
      box-sizing:border-box !important;
      border-right:none !important;
      padding:16px !important;
    }
    .details-stack-pad {
      display:block !important;
      width:100% !important;
      max-width:100% !important;
      box-sizing:border-box !important;
      border-top:1px solid ${C.border} !important;
      border-right:none !important;
      padding:16px !important;
    }

    /* Order items: hide Qty/Price — qty already under product name */
    .col-hide {
      display:none !important;
      width:0 !important;
      max-width:0 !important;
      overflow:hidden !important;
      font-size:0 !important;
      line-height:0 !important;
      padding:0 !important;
      border:0 !important;
    }
    .item-total { white-space:nowrap !important; padding-left:8px !important; vertical-align:middle !important; }

    /* Status: vertical list for Gmail readability */
    .status-step {
      display:block !important;
      width:100% !important;
      max-width:100% !important;
      text-align:left !important;
      padding:10px 0 !important;
      box-sizing:border-box !important;
      border-bottom:1px solid ${C.border} !important;
      font-size:13px !important;
    }
    .status-step-last { border-bottom:none !important; }
    .status-dot {
      display:inline-block !important;
      margin:0 10px 0 0 !important;
      vertical-align:middle !important;
    }
    .status-label { display:inline-block !important; vertical-align:middle !important; }
    .status-sub { display:inline !important; margin-left:6px !important; }

    .btn-wrap { width:100% !important; }
    .btn-link {
      display:block !important;
      width:100% !important;
      box-sizing:border-box !important;
      text-align:center !important;
      padding:14px 16px !important;
    }

    .footer-stack { display:block !important; width:100% !important; text-align:left !important; padding-top:12px !important; }
    .help-link { display:block !important; padding:6px 0 !important; font-size:13px !important; }
    .help-sep { display:none !important; font-size:0 !important; }
    .trust-col {
      display:block !important;
      width:100% !important;
      max-width:100% !important;
      padding:0 0 10px 0 !important;
      text-align:left !important;
    }
    .copyright-left, .copyright-right {
      display:block !important;
      width:100% !important;
      text-align:left !important;
      padding:8px 16px !important;
    }
  }
</style>
</head>
<body class="body" style="margin:0;padding:0;background-color:${C.warm};">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;opacity:0;color:transparent;height:0;width:0;">
  ${escapeHtml(preheader)}
&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
</div>

<center style="width:100%;background-color:${C.warm};">
<div style="max-width:620px;margin:0 auto;" class="email-container">
<!--[if mso]>
<table role="presentation" width="620" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td>
<![endif]-->

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:620px;margin:0 auto;background-color:${C.cream};width:100%;">
${body}
</table>

<!--[if mso]>
</td></tr></table>
<![endif]-->
</div>
</center>
</body>
</html>`;
}

function brandMark(size = 52, emojiSize = 22) {
  return `<td style="width:${size}px;height:${size}px;border:2px solid rgba(255,255,255,0.55);border-radius:50%;text-align:center;vertical-align:middle;font-size:${emojiSize}px;line-height:${size}px;" valign="middle">🏡</td>`;
}

function heroSection() {
  return `<tr>
    <td style="background-color:${C.green};padding:36px 40px 60px 40px;" class="hero-pad">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="padding-bottom:26px;" valign="middle">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr>
                ${brandMark()}
                <td style="padding-left:14px;" valign="middle">
                  <div class="brand-title" style="font-family:Georgia,'Times New Roman',serif;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:1.5px;">${escapeHtml(SITE_NAME.toUpperCase())}</div>
                  <div style="font-family:Arial,Helvetica,sans-serif;color:${C.tagline};font-size:11px;letter-spacing:0.5px;margin-top:2px;">FROM OUR FARM, TO YOUR HOME</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td>
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="font-family:Georgia,'Times New Roman',serif;color:#ffffff;font-size:30px;font-weight:400;" class="h1-mobile">Order Confirmed!</td>
                <td style="padding-left:12px;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                    <tr><td style="width:26px;height:26px;background-color:${C.greenCheck};border-radius:50%;text-align:center;vertical-align:middle;color:#ffffff;font-size:14px;line-height:26px;font-family:Arial,sans-serif;">✓</td></tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding-top:14px;font-family:Arial,Helvetica,sans-serif;color:${C.heroMuted};font-size:14px;line-height:22px;">
            Thank you for choosing ${escapeHtml(SITE_NAME)}. We've received your order and are preparing it with care. 🌱
          </td>
        </tr>
      </table>
    </td>
  </tr>`;
}

function summaryCell(icon, label, valueHtml, { border = true, lastRow = false } = {}) {
  const borderRight = border ? `border-right:1px solid ${C.border};` : "";
  const lastClass = lastRow ? " summary-cell-last-row" : "";
  return `<td width="25%" align="center" class="summary-cell${lastClass}" style="${borderRight}font-family:Arial,Helvetica,sans-serif;vertical-align:top;">
                  <div style="font-size:20px;line-height:1;margin-bottom:6px;">${icon}</div>
                  <div style="font-size:10px;letter-spacing:0.5px;color:${C.muted};text-transform:uppercase;">${escapeHtml(label)}</div>
                  ${valueHtml}
                </td>`;
}

function summaryCard(order) {
  const payment = paymentLabel(order);
  const total = formatPrice(Number(order.total));
  const items = itemCountLabel(order.items);
  const eta = formatDeliveryEstimate(order.created_at);

  return `<tr>
    <td style="padding:0 24px;" class="summary-wrap">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="summary-card" style="background-color:${C.white};border-radius:12px;margin-top:-34px;box-shadow:0 6px 18px rgba(0,0,0,0.08);">
        <tr>
          <td style="padding:22px 8px;" class="summary-inner">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                ${summaryCell(
                  "💳",
                  "Payment Method",
                  `<div style="font-family:Georgia,serif;font-size:16px;font-weight:700;color:${C.green};margin-top:4px;">${escapeHtml(payment)}</div>
                  <div style="display:inline-block;margin-top:6px;background-color:${C.greenSoft};color:${C.greenText};font-size:10px;padding:2px 10px;border-radius:10px;">Paid</div>`,
                )}
                ${summaryCell(
                  "₹",
                  "Order Total",
                  `<div style="font-family:Georgia,serif;font-size:16px;font-weight:700;color:${C.green};margin-top:4px;">${escapeHtml(total)}</div>`,
                  { border: true },
                )}
                ${summaryCell(
                  "📦",
                  "Items",
                  `<div style="font-family:Georgia,serif;font-size:16px;font-weight:700;color:${C.green};margin-top:4px;">${escapeHtml(items)}</div>`,
                  { border: true, lastRow: true },
                )}
                ${summaryCell(
                  "🚚",
                  "Est. Delivery",
                  `<div style="font-family:Georgia,serif;font-size:16px;font-weight:700;color:${C.green};margin-top:4px;">${escapeHtml(eta)}</div>`,
                  { border: false, lastRow: true },
                )}
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>`;
}

function customerDeliverySection(order) {
  const phone = formatPhone(order.phone);
  const tel = formatPhoneTel(order.phone);
  const emailRow = order.email
    ? `<div style="font-size:13px;line-height:20px;margin:0;word-break:break-word;"><a href="mailto:${escapeHtml(order.email)}" style="color:${C.link};">✉️ ${escapeHtml(order.email)}</a></div>`
    : "";

  return `<tr>
    <td style="padding:22px 24px 0 24px;" class="px-mobile">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${C.white};border-radius:12px;">
        <tr>
          <td width="50%" valign="top" class="details-stack" style="width:50%;vertical-align:top;padding:20px;font-family:Arial,Helvetica,sans-serif;border-right:1px solid ${C.border};">
            <div style="font-family:Georgia,serif;font-weight:700;color:${C.green};font-size:15px;line-height:22px;margin:0 0 14px 0;">👤&nbsp; Customer Details</div>
            <div style="font-size:13px;line-height:20px;color:${C.ink};margin:0 0 8px 0;">👤 ${escapeHtml(order.name)}</div>
            <div style="font-size:13px;line-height:20px;color:${C.ink};margin:0 0 8px 0;"><a href="tel:${escapeHtml(tel)}" style="color:${C.ink};">📞 ${phone}</a></div>
            ${emailRow}
          </td>
          <td width="50%" valign="top" class="details-stack details-stack-pad" style="width:50%;vertical-align:top;padding:20px;font-family:Arial,Helvetica,sans-serif;">
            <div style="font-family:Georgia,serif;font-weight:700;color:${C.green};font-size:15px;line-height:22px;margin:0 0 14px 0;">📍&nbsp; Delivery Address</div>
            <div style="font-size:13px;line-height:20px;color:${C.ink};white-space:pre-wrap;margin:0;word-break:break-word;">${escapeHtml(order.address)}</div>
          </td>
        </tr>
      </table>
    </td>
  </tr>`;
}

function itemThumb(item, siteUrl) {
  if (item.image) {
    const src = absUrl(siteUrl, item.image);
    return `<td style="width:48px;height:48px;border-radius:8px;overflow:hidden;background-color:#f2dda3;">
      <img src="${escapeHtml(src)}" alt="" width="48" height="48" style="display:block;width:48px;height:48px;object-fit:cover;border-radius:8px;"/>
    </td>`;
  }
  return `<td style="width:48px;height:48px;background-color:#f2dda3;border-radius:8px;text-align:center;vertical-align:middle;font-size:20px;">🌱</td>`;
}

function orderItemsSection(order, siteUrl) {
  const rows = (order.items || [])
    .map((item) => {
      const qty = qtyLabel(item);
      const price = formatPrice(Number(item.price));
      const total = formatPrice(lineTotal(item));
      return `<tr>
              <td style="padding:14px 0;border-bottom:1px solid ${C.border};vertical-align:middle;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    ${itemThumb(item, siteUrl)}
                    <td style="padding-left:12px;vertical-align:middle;">
                      <div style="font-weight:700;color:${C.green};font-size:13px;line-height:18px;">${escapeHtml(item.name)}</div>
                      <div style="font-size:11px;color:${C.muted};line-height:16px;margin-top:2px;">${escapeHtml(qty)} · ${escapeHtml(price)}</div>
                    </td>
                  </tr>
                </table>
              </td>
              <td align="right" class="col-hide" style="padding:14px 0;border-bottom:1px solid ${C.border};font-size:13px;color:${C.ink};">${escapeHtml(qty)}</td>
              <td align="right" class="col-hide" style="padding:14px 0;border-bottom:1px solid ${C.border};font-size:13px;color:${C.ink};">${escapeHtml(price)}</td>
              <td align="right" class="item-total" style="padding:14px 0;border-bottom:1px solid ${C.border};font-size:13px;font-weight:700;color:${C.green};vertical-align:middle;">${escapeHtml(total)}</td>
            </tr>`;
    })
    .join("");

  const sub = formatPrice(subtotal(order.items));
  const grand = formatPrice(Number(order.total));

  return `<tr>
    <td style="padding:20px 24px 0 24px;" class="px-mobile">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${C.white};border-radius:12px;">
        <tr><td style="padding:22px;font-family:Arial,Helvetica,sans-serif;" class="card-pad">
          <div style="font-family:Georgia,serif;font-weight:700;color:${C.green};font-size:15px;margin-bottom:16px;">🛍️&nbsp; Order Items</div>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="font-size:10px;letter-spacing:0.5px;color:${C.muted};text-transform:uppercase;border-bottom:1px solid ${C.border};padding-bottom:10px;">Item</td>
              <td align="right" class="col-hide" style="font-size:10px;letter-spacing:0.5px;color:${C.muted};text-transform:uppercase;border-bottom:1px solid ${C.border};padding-bottom:10px;">Qty</td>
              <td align="right" class="col-hide" style="font-size:10px;letter-spacing:0.5px;color:${C.muted};text-transform:uppercase;border-bottom:1px solid ${C.border};padding-bottom:10px;">Price</td>
              <td align="right" class="item-total" style="font-size:10px;letter-spacing:0.5px;color:${C.muted};text-transform:uppercase;border-bottom:1px solid ${C.border};padding-bottom:10px;">Total</td>
            </tr>
            ${rows}
          </table>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:6px;">
            <tr>
              <td style="padding:6px 0;font-size:13px;color:${C.ink};">Subtotal</td>
              <td align="right" style="padding:6px 0;font-size:13px;color:${C.ink};">${escapeHtml(sub)}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;font-size:13px;color:${C.ink};">Delivery Charges <span style="background-color:${C.greenSoft};color:${C.greenText};font-size:10px;padding:2px 8px;border-radius:9px;">FREE</span></td>
              <td align="right" style="padding:6px 0;font-size:13px;color:${C.ink};">${escapeHtml(formatPrice(0))}</td>
            </tr>
            <tr>
              <td style="padding:12px 0 0 0;border-top:1px solid ${C.border};font-family:Georgia,serif;font-weight:700;font-size:16px;color:${C.green};">Total Amount</td>
              <td align="right" style="padding:12px 0 0 0;border-top:1px solid ${C.border};font-family:Georgia,serif;font-weight:700;font-size:16px;color:${C.green};">${escapeHtml(grand)}</td>
            </tr>
          </table>
        </td></tr>
      </table>
    </td>
  </tr>`;
}

function statusStep(label, { active, icon, subtext = "", last = false }) {
  const lastClass = last ? " status-step-last" : "";
  if (active) {
    return `<td width="25%" align="center" class="status-step${lastClass}" style="font-size:12px;color:${C.greenText};font-weight:700;vertical-align:top;">
                <div class="status-dot" style="width:34px;height:34px;background-color:${C.greenMid};border-radius:50%;color:#ffffff;text-align:center;line-height:34px;margin:0 auto 8px auto;">✓</div>
                <span class="status-label">${escapeHtml(label)}</span>
                ${subtext ? `<div class="status-sub" style="font-weight:400;color:${C.muted};font-size:10px;margin-top:2px;">${escapeHtml(subtext)}</div>` : ""}
              </td>`;
  }
  return `<td width="25%" align="center" class="status-step${lastClass}" style="font-size:12px;color:${C.muted};font-weight:600;vertical-align:top;">
                <div class="status-dot" style="width:34px;height:34px;background-color:${C.softGray};border-radius:50%;color:${C.softGrayIcon};text-align:center;line-height:34px;margin:0 auto 8px auto;">${icon}</div>
                <span class="status-label">${escapeHtml(label)}</span>
              </td>`;
}

function statusSection(order, ctaHref, ctaLabel) {
  const status = order.status || "paid";
  const confirmedAt = formatShortDateTime(order.created_at);
  const preparing = ["shipped", "delivered"].includes(status);
  const shipping = status === "shipped" || status === "delivered";
  const delivered = status === "delivered";

  return `<tr>
    <td style="padding:20px 24px 0 24px;" class="px-mobile">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${C.white};border-radius:12px;">
        <tr><td style="padding:22px;font-family:Arial,Helvetica,sans-serif;" class="card-pad">
          <div style="font-family:Georgia,serif;font-weight:700;color:${C.green};font-size:15px;margin-bottom:18px;">🚚&nbsp; Order Status</div>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              ${statusStep("Order Confirmed", { active: true, subtext: confirmedAt })}
              ${statusStep("Preparing Order", { active: preparing, icon: "📦" })}
              ${statusStep("Out for Delivery", { active: shipping && !delivered, icon: "🚚" })}
              ${statusStep("Delivered", { active: delivered, icon: "🏠", last: true })}
            </tr>
          </table>

          <table role="presentation" cellpadding="0" cellspacing="0" border="0" class="btn-wrap" style="margin:24px auto 0 auto;width:100%;">
            <tr>
              <td align="center" bgcolor="${C.green}" style="border-radius:8px;">
                <a href="${escapeHtml(ctaHref)}" class="btn-link" style="display:block;padding:13px 26px;font-family:Arial,Helvetica,sans-serif;font-weight:700;font-size:13px;color:#ffffff;text-align:center;">📦 ${escapeHtml(ctaLabel)}</a>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>
    </td>
  </tr>`;
}

function helpSection() {
  const wa = whatsappUrl();
  const tel = `+${WHATSAPP_NUMBER}`;
  return `<tr>
    <td style="padding:20px 24px 0 24px;" class="px-mobile">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${C.greenSoft};border-radius:12px;">
        <tr><td style="padding:20px 24px;font-family:Arial,Helvetica,sans-serif;" class="card-pad">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td class="stack" style="font-family:Georgia,serif;font-weight:700;color:${C.green};font-size:15px;vertical-align:top;">
                Need Help?
                <div style="font-family:Arial,Helvetica,sans-serif;font-weight:400;font-size:11px;color:${C.muted};margin-top:2px;">We're here for you!</div>
              </td>
              <td class="stack footer-stack" align="right" style="font-size:12px;vertical-align:top;line-height:22px;">
                <a class="help-link" href="tel:${escapeHtml(tel)}" style="color:${C.green};">📞 ${escapeHtml(WHATSAPP_DISPLAY)}</a>
                <span class="help-sep" style="color:${C.muted};">&nbsp;&nbsp;·&nbsp;&nbsp;</span>
                <a class="help-link" href="mailto:${escapeHtml(CONTACT_EMAIL)}" style="color:${C.green};">✉️ ${escapeHtml(CONTACT_EMAIL)}</a>
                <span class="help-sep" style="color:${C.muted};">&nbsp;&nbsp;·&nbsp;&nbsp;</span>
                <a class="help-link" href="${escapeHtml(wa)}" style="color:${C.green};">💬 WhatsApp</a>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>
    </td>
  </tr>`;
}

function footerSection() {
  const year = new Date().getFullYear();
  const wa = whatsappUrl();
  return `<tr>
    <td style="padding:24px;" class="px-mobile">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${C.greenSoft};border-radius:12px;">
        <tr><td style="padding:24px;font-family:Arial,Helvetica,sans-serif;" class="card-pad">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td class="stack" valign="top">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="width:40px;height:40px;border:2px solid ${C.green};border-radius:50%;text-align:center;vertical-align:middle;font-size:16px;">🏡</td>
                    <td style="padding-left:12px;" valign="middle">
                      <div style="font-family:Georgia,serif;font-weight:700;color:${C.green};font-size:14px;">${escapeHtml(SITE_NAME.toUpperCase())}</div>
                    </td>
                  </tr>
                </table>
                <div style="font-size:11px;color:${C.ink};max-width:280px;margin-top:10px;line-height:1.5;">Thank you for supporting local farming and choosing ${escapeHtml(SITE_NAME)}. 💚</div>
              </td>
              <td class="stack stack-pad" valign="top" align="right">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
                  <td class="trust-col" style="padding-right:20px;font-size:11px;color:${C.ink};vertical-align:top;">
                    <div style="font-family:Georgia,serif;color:${C.green};font-size:12px;margin-bottom:3px;">🌿 100% Natural</div>
                    No chemicals, no hormones
                  </td>
                  <td class="trust-col" style="padding-right:20px;font-size:11px;color:${C.ink};vertical-align:top;">
                    <div style="font-family:Georgia,serif;color:${C.green};font-size:12px;margin-bottom:3px;">🏡 Farm Fresh</div>
                    Direct from our farm
                  </td>
                  <td class="trust-col" style="font-size:11px;color:${C.ink};vertical-align:top;">
                    <div style="font-family:Georgia,serif;color:${C.green};font-size:12px;margin-bottom:3px;">❤️ Trusted Quality</div>
                    Safe for your family
                  </td>
                </tr></table>
              </td>
            </tr>
          </table>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="copyright-bar" style="margin-top:20px;background-color:${C.green};border-radius:8px;">
            <tr>
              <td class="copyright-left" style="padding:12px 18px;font-size:11px;color:${C.footerBar};">© ${year} ${escapeHtml(SITE_NAME)}. All rights reserved.</td>
              <td class="copyright-right" align="right" style="padding:12px 18px;font-size:12px;color:${C.footerBar};">
                <a href="${escapeHtml(INSTAGRAM_URL)}" style="color:${C.footerBar};text-decoration:none;">📷 Instagram</a>&nbsp;&nbsp;
                <a href="${escapeHtml(wa)}" style="color:${C.footerBar};text-decoration:none;">💬 WhatsApp</a>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>
    </td>
  </tr>`;
}

function adminHero(order) {
  const total = formatPrice(Number(order.total));
  const payment = paymentLabel(order);
  return `<tr>
    <td style="background-color:${C.green};padding:28px 32px 70px 32px;" class="hero-pad">
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.7);">New sale</div>
      <div class="h1-mobile" style="font-family:Georgia,'Times New Roman',serif;color:#ffffff;font-size:24px;font-weight:400;margin-top:6px;">New order — ${escapeHtml(total)}</div>
      <div style="font-family:Arial,Helvetica,sans-serif;color:${C.heroMuted};font-size:13px;line-height:20px;margin-top:8px;word-break:break-word;">
        ${escapeHtml(order.name)} · ${escapeHtml(payment)} · ${escapeHtml(formatOrderDate(order.created_at))}
      </div>
    </td>
  </tr>`;
}

function adminCta(href) {
  return `<tr>
    <td style="padding:20px 24px 0 24px;" class="px-mobile">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${C.white};border-radius:12px;">
        <tr><td style="padding:22px;font-family:Arial,Helvetica,sans-serif;" class="card-pad" align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" class="btn-wrap" width="100%">
            <tr>
              <td align="center" bgcolor="${C.green}" style="border-radius:8px;">
                <a href="${escapeHtml(href)}" class="btn-link" style="display:block;padding:13px 26px;font-family:Arial,Helvetica,sans-serif;font-weight:700;font-size:13px;color:#ffffff;text-align:center;">Open admin orders →</a>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>
    </td>
  </tr>`;
}

/** Customer-facing order confirmation — matches the brand HTML mock. */
export function customerOrderEmail(order, { siteUrl } = {}) {
  const total = formatPrice(Number(order.total));
  const summary = itemSummary(order.items);
  const subject = summary
    ? `Order confirmed: ${summary} — ${total}`
    : `Your ${SITE_NAME} order is confirmed — ${total}`;

  const ordersUrl = siteUrl ? `${siteUrl.replace(/\/$/, "")}/account/orders` : "#";
  const id = shortId(order.id);
  const preheader = `Your ${SITE_NAME} order${id ? ` #${id}` : ""} is confirmed — total ${total}. We're preparing it now.`;

  const html = emailShell({
    title: `Order Confirmed - ${SITE_NAME}`,
    preheader,
    body: `
  ${heroSection()}
  ${summaryCard(order)}
  ${customerDeliverySection(order)}
  ${orderItemsSection(order, siteUrl)}
  ${statusSection(order, ordersUrl, "View Order Details")}
  ${helpSection()}
  ${footerSection()}
`,
  });

  return { subject, html };
}

/** Admin notification — same visual system, action-focused. */
export function adminOrderEmail(order, { siteUrl } = {}) {
  const total = formatPrice(Number(order.total));
  const subject = `New order from ${order.name} — ${total}`;
  const adminUrl = siteUrl ? `${siteUrl.replace(/\/$/, "")}/admin/orders` : "#";
  const id = shortId(order.id);
  const preheader = `New paid order${id ? ` #${id}` : ""} from ${order.name} — ${total}.`;

  const html = emailShell({
    title: `New Order - ${SITE_NAME}`,
    preheader,
    body: `
  ${adminHero(order)}
  ${summaryCard(order)}
  ${customerDeliverySection(order)}
  ${orderItemsSection(order, siteUrl)}
  ${adminCta(adminUrl)}
  ${helpSection()}
`,
  });

  return { subject, html };
}
