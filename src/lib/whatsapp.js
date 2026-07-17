import { formatPrice, pluralizeUnit } from "./format";
import { WHATSAPP_NUMBER } from "./site";

function waUrl(text) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function getGenericInquiryUrl() {
  const text =
    "Hello Maran Farms! I'd like to know more about your Napier plants, chicks, and small pets.";
  return waUrl(text);
}

export function getProductOrderUrl(product, quantity) {
  const unit = pluralizeUnit(
    product.minOrderUnit || product.unit.replace("per ", ""),
    quantity,
  );
  const text = `Hello Maran Farms! I'd like to order:\n\n• ${product.name} × ${quantity} ${unit}\n\nPlease confirm availability and delivery.`;
  return waUrl(text);
}

export function getCartOrderUrl(lines, total) {
  const itemLines = lines
    .map((line) => {
      const unit = pluralizeUnit(
        line.product.minOrderUnit || line.product.unit.replace("per ", ""),
        line.quantity,
      );
      return `• ${line.product.name} — ${line.quantity} ${unit} × ${formatPrice(line.product.price)} = ${formatPrice(line.product.price * line.quantity)}`;
    })
    .join("\n");

  const text = `🌾 New Order — Maran Farms\n\n${itemLines}\n\nTotal: ${formatPrice(total)}\n\nPlease confirm availability, delivery timeline, and final billing.`;
  return waUrl(text);
}
