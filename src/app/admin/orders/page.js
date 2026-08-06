import Link from "next/link";
import { Plus } from "lucide-react";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { formatPrice } from "@/lib/format";
import { PAYMENT_METHOD_LABELS } from "@/lib/orders/payment-methods";
import { OrderStatusSelect } from "@/app/admin/orders/order-status-select";
import { MarkPaidButton } from "@/app/admin/orders/mark-paid-button";
import { AdminTable, AdminTableRow } from "@/components/admin/admin-table";
import {
  AdminPageHeader,
  adminPrimaryButton,
  SupabaseNotConfigured,
} from "@/components/admin/admin-page-header";

const PAGE_SIZE = 25;

export default async function AdminOrdersPage({ searchParams }) {
  const params = await searchParams;
  const page = Math.max(1, Number(params?.page) || 1);
  const status = params?.status || "all";
  const search = params?.search || "";

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return <SupabaseNotConfigured title="Orders" />;
  }

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
      <AdminPageHeader
        title="Orders"
        subtitle={`${count || 0} total orders`}
        action={
          <Link href="/admin/orders/new" className={adminPrimaryButton}>
            <Plus className="size-4" />
            New phone order
          </Link>
        }
      />

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

      <AdminTable
        columns={[
          "Order ID",
          "Customer",
          "Items",
          { label: "Total", align: "right" },
          "Channel",
          "Status",
          "Date",
        ]}
        isEmpty={(orders || []).length === 0}
        empty="No orders found."
      >
        {(orders || []).map((order, i) => (
              <AdminTableRow key={order.id} index={i}>
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
                  {order.notes ? (
                    <p className="mt-1 text-xs italic text-farm-sage/80">{order.notes}</p>
                  ) : null}
                </td>
                <td className="px-5 py-4 text-right font-semibold tabular-nums text-farm-green-dark">
                  {formatPrice(order.total)}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      order.origin === "phone"
                        ? "bg-farm-accent/15 text-farm-accent"
                        : "bg-farm-green/10 text-farm-green-dark"
                    }`}
                  >
                    {order.origin === "phone" ? "Phone" : "Web"}
                  </span>
                  {order.payment_method ? (
                    <p className="mt-1 text-[11px] text-farm-sage">
                      {PAYMENT_METHOD_LABELS[order.payment_method] || order.payment_method}
                    </p>
                  ) : null}
                </td>
                <td className="px-5 py-4">
                  <OrderStatusSelect orderId={order.id} status={order.status} />
                  {order.status === "pending" && <MarkPaidButton orderId={order.id} />}
                </td>
                <td className="px-5 py-4 text-xs text-farm-sage">
                  {new Date(order.created_at).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
              </AdminTableRow>
            ))}
      </AdminTable>

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
