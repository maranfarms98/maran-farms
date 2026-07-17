const LABELS = {
  bulk: "Bulk",
  new: "New",
  limited: "Limited Stock",
  bestseller: "Bestseller",
};

export function ProductBadge({ type, className = "" }) {
  if (!type || !LABELS[type]) return null;
  return (
    <span
      className={`inline-flex items-center rounded-full bg-farm-accent px-2.5 py-1 text-[0.65rem] font-semibold tracking-[0.12em] text-white uppercase ${className}`}
    >
      {LABELS[type]}
    </span>
  );
}
