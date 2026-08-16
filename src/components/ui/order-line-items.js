import { formatPrice } from "@/lib/format";

/**
 * The "name × qty … line total" list shared by checkout and the order card.
 * Items only need `key`, `name`, `quantity`, and `lineTotal`.
 */
export function OrderLineItems({ items, className = "space-y-2" }) {
  return (
    <ul className={className}>
      {items.map((item) => (
        <li key={item.key} className="flex justify-between gap-3 text-sm text-farm-sage">
          <span className="min-w-0 break-words">
            {item.name} × {item.quantity}
          </span>
          <span className="shrink-0 tabular-nums text-farm-green-dark">
            {formatPrice(item.lineTotal)}
          </span>
        </li>
      ))}
    </ul>
  );
}
