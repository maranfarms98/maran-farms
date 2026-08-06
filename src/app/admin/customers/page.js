import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { formatPrice } from "@/lib/format";
import { AdminTable, AdminTableRow } from "@/components/admin/admin-table";
import {
  AdminPageHeader,
  SupabaseNotConfigured,
} from "@/components/admin/admin-page-header";

const REVENUE_STATUSES = ["paid", "shipped", "delivered"];

export default async function AdminCustomersPage() {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return <SupabaseNotConfigured title="Customers" />;
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
      <AdminPageHeader
        title="Customers"
        subtitle={`${customers.length} registered customers`}
      />

      <AdminTable
        columns={[
          "Name",
          "Phone",
          "Orders",
          { label: "Total Spend", align: "right" },
          "Last Order",
          "Joined",
        ]}
        isEmpty={customers.length === 0}
        empty="No customers yet."
      >
        {customers
              .sort((a, b) => b.spend - a.spend)
              .map((c, i) => (
                <AdminTableRow key={c.id} index={i}>
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
                </AdminTableRow>
              ))}
      </AdminTable>
    </div>
  );
}
