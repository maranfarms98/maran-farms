/** Shared shell for the admin list tables: card wrapper, header row, zebra rows. */
export function AdminTable({ columns, children, empty, isEmpty }) {
  return (
    <div className="mt-6 overflow-x-auto rounded-3xl border border-farm-green-dark/10 bg-farm-cream">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-farm-green-dark/8 text-left text-xs font-semibold uppercase tracking-wider text-farm-sage">
            {columns.map((col, i) => (
              <th
                key={typeof col === "string" ? col || i : col.label || i}
                className={`px-5 py-4${col.align === "right" ? " text-right" : ""}`}
              >
                {typeof col === "string" ? col : col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {children}
          {isEmpty && (
            <tr>
              <td colSpan={columns.length} className="px-5 py-10 text-center text-farm-sage">
                {empty}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export function AdminTableRow({ index, children }) {
  return (
    <tr
      className={`border-b border-farm-green-dark/6 last:border-0 ${index % 2 ? "bg-farm-warm/40" : ""}`}
    >
      {children}
    </tr>
  );
}
