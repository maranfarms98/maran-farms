import { formatPrice } from "@/lib/format";

/**
 * The "name × qty … line total" list shared by checkout and the order card.
 * Items only need `key`, `name`, `quantity`, and `lineTotal`.
 */
export function OrderLineItems({ items, className = "space-y-2" }) {
  return (
    <ul className={className}>
      {items.map((item) => (
        <li key={item.key} className="flex justify-between text-sm text-farm-sage">
          <span>
            {item.name} × {item.quantity}
          </span>
          <span className="tabular-nums text-farm-green-dark">
            {formatPrice(item.lineTotal)}
          </span>
        </li>
      ))}
    </ul>
  );
}
