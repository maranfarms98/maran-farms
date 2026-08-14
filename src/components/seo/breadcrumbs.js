import Link from "next/link";

export function Breadcrumbs({ items, tone = "dark" }) {
  const muted = tone === "light" ? "text-white/80" : "text-farm-sage";
  const current = tone === "light" ? "text-white" : "text-farm-green-dark";
  const hover = tone === "light" ? "hover:text-white" : "hover:text-farm-green";

  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.href}-${item.name}`} className="flex items-center gap-2">
              {i > 0 && (
                <span className={muted} aria-hidden>
                  /
                </span>
              )}
              {last ? (
                <span className={`font-medium ${current}`}>{item.name}</span>
              ) : (
                <Link
                  href={item.href}
                  className={`focus-ring rounded-sm ${muted} ${hover}`}
                >
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
