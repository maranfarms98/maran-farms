import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { formatPrice } from "@/lib/format";
import { OrderStatusSelect } from "@/app/admin/orders/order-status-select";

const PAGE_SIZE = 25;

export default async function AdminOrdersPage({ searchParams }) {
  const params = await searchParams;
  const page = Math.max(1, Number(params?.page) || 1);
  const status = params?.status || "all";
  const search = params?.search || "";

  const supabase = getSupabaseAdminClient();
  let query = supabase
    .from("orders")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (status !== "all") query = query.eq("status", status);
  if (search) query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%`);

  const from = (page - 1) * PAGE_SIZE;
  const { data: orders, count, error } = await query.range(from, from + PAGE_SIZE - 1);

  if (error) console.error("[admin/orders]", error);

  const totalPages = Math.max(1, Math.ceil((count || 0) / PAGE_SIZE));

  return (
    <div>
      <h1 className="font-heading text-3xl text-farm-green-dark">Orders</h1>
      <p className="mt-1 text-sm text-farm-sage">{count || 0} total orders</p>

      <form className="mt-6 flex flex-wrap gap-3" method="get">
        <input
          type="text"
          name="search"
          defaultValue={search}
          placeholder="Search by name or phone"
          className="h-11 flex-1 min-w-[200px] rounded-full border border-farm-green-dark/15 bg-farm-cream px-4 text-sm focus:border-farm-green focus:outline-none"
        />
        <select
          name="status"
          defaultValue={status}
          className="h-11 rounded-full border border-farm-green-dark/15 bg-farm-cream px-4 text-sm capitalize focus:border-farm-green focus:outline-none"
        >
          {["all", "pending", "paid", "shipped", "delivered", "cancelled"].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <button
          type="submit"
          className="h-11 rounded-full bg-farm-green px-6 text-sm font-semibold text-farm-green-light"
        >
          Filter
        </button>
      </form>

      <div className="mt-6 overflow-x-auto rounded-3xl border border-farm-green-dark/10 bg-farm-cream">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-farm-green-dark/8 text-left text-xs font-semibold uppercase tracking-wider text-farm-sage">
              <th className="px-5 py-4">Order ID</th>
              <th className="px-5 py-4">Customer</th>
              <th className="px-5 py-4">Items</th>
              <th className="px-5 py-4 text-right">Total</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {(orders || []).map((order, i) => (
              <tr
                key={order.id}
                className={`border-b border-farm-green-dark/6 last:border-0 ${i % 2 ? "bg-farm-warm/40" : ""}`}
              >
                <td className="px-5 py-4 font-mono text-xs text-farm-sage">
                  {order.id.slice(0, 8)}
                </td>
                <td className="px-5 py-4">
                  <p className="font-medium text-farm-green-dark">{order.name}</p>
                  <p className="text-xs text-farm-sage">{order.phone}</p>
                </td>
                <td className="px-5 py-4 text-farm-sage">
                  {(order.items || []).map((it) => (
                    <div key={it.productId}>{it.name} × {it.quantity}</div>
                  ))}
                </td>
                <td className="px-5 py-4 text-right font-semibold tabular-nums text-farm-green-dark">
                  {formatPrice(order.total)}
                </td>
                <td className="px-5 py-4">
                  <OrderStatusSelect orderId={order.id} status={order.status} />
                </td>
                <td className="px-5 py-4 text-xs text-farm-sage">
                  {new Date(order.created_at).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
              </tr>
            ))}
            {(orders || []).length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-farm-sage">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2 text-sm">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`?page=${p}&status=${status}&search=${search}`}
              className={`flex size-9 items-center justify-center rounded-full ${
                p === page
                  ? "bg-farm-green text-farm-green-light"
                  : "bg-farm-cream text-farm-green-dark hover:bg-farm-accent-light"
              }`}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
