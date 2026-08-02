import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { formatPrice } from "@/lib/format";

const REVENUE_STATUSES = ["paid", "shipped", "delivered"];

export default async function AdminCustomersPage() {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return (
      <div>
        <h1 className="font-heading text-3xl text-farm-green-dark">Customers</h1>
        <p className="mt-4 text-sm text-farm-sage">
          Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and
          SUPABASE_SERVICE_ROLE_KEY in the deployment environment.
        </p>
      </div>
    );
  }

  const [{ data: profiles }, { data: orders }] = await Promise.all([
    supabase.from("profiles").select("*").order("created_at", { ascending: false }),
    supabase.from("orders").select("profile_id, total, status, created_at"),
  ]);

  const stats = new Map();
  for (const o of orders || []) {
    if (!o.profile_id || !REVENUE_STATUSES.includes(o.status)) continue;
    const cur = stats.get(o.profile_id) || { orders: 0, spend: 0, lastOrder: null };
    cur.orders += 1;
    cur.spend += Number(o.total);
    if (!cur.lastOrder || o.created_at > cur.lastOrder) cur.lastOrder = o.created_at;
    stats.set(o.profile_id, cur);
  }

  const customers = (profiles || []).map((p) => ({
    ...p,
    ...(stats.get(p.id) || { orders: 0, spend: 0, lastOrder: null }),
  }));

  return (
    <div>
      <h1 className="font-heading text-3xl text-farm-green-dark">Customers</h1>
      <p className="mt-1 text-sm text-farm-sage">{customers.length} registered customers</p>

      <div className="mt-6 overflow-x-auto rounded-3xl border border-farm-green-dark/10 bg-farm-cream">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-farm-green-dark/8 text-left text-xs font-semibold uppercase tracking-wider text-farm-sage">
              <th className="px-5 py-4">Name</th>
              <th className="px-5 py-4">Phone</th>
              <th className="px-5 py-4">Orders</th>
              <th className="px-5 py-4 text-right">Total Spend</th>
              <th className="px-5 py-4">Last Order</th>
              <th className="px-5 py-4">Joined</th>
            </tr>
          </thead>
          <tbody>
            {customers
              .sort((a, b) => b.spend - a.spend)
              .map((c, i) => (
                <tr
                  key={c.id}
                  className={`border-b border-farm-green-dark/6 last:border-0 ${i % 2 ? "bg-farm-warm/40" : ""}`}
                >
                  <td className="px-5 py-4 font-medium text-farm-green-dark">
                    {c.name}
                    {c.is_admin && (
                      <span className="ml-2 rounded-full bg-farm-green/10 px-2 py-0.5 text-[0.65rem] font-semibold text-farm-green">
                        Admin
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-farm-sage">{c.phone}</td>
                  <td className="px-5 py-4 text-farm-sage">{c.orders}</td>
                  <td className="px-5 py-4 text-right font-semibold tabular-nums text-farm-green-dark">
                    {formatPrice(c.spend)}
                  </td>
                  <td className="px-5 py-4 text-xs text-farm-sage">
                    {c.lastOrder
                      ? new Date(c.lastOrder).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                        })
                      : "—"}
                  </td>
                  <td className="px-5 py-4 text-xs text-farm-sage">
                    {new Date(c.created_at).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-farm-sage">
                  No customers yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
