import "server-only";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

const REVENUE_STATUSES = ["paid", "shipped", "delivered"];

export async function getAnalytics() {
  const supabase = getSupabaseAdminClient();

  const [{ data: orders }, { data: products }, { data: profiles }] = await Promise.all([
    supabase
      .from("orders")
      .select("id, total, status, items, profile_id, created_at")
      .order("created_at", { ascending: false })
      .limit(1000),
    supabase.from("products").select("id, category:categories(name)"),
    supabase.from("profiles").select("id, name, phone"),
  ]);

  const allOrders = orders || [];
  const revenueOrders = allOrders.filter((o) => REVENUE_STATUSES.includes(o.status));
  const revenue = revenueOrders.reduce((sum, o) => sum + Number(o.total), 0);
  const orderCount = revenueOrders.length;
  const aov = orderCount ? revenue / orderCount : 0;

  // last 30 days trend
  const days = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  const byDay = Object.fromEntries(
    days.map((d) => [d, { date: d.slice(5), revenue: 0, orders: 0 }]),
  );
  for (const o of revenueOrders) {
    const day = o.created_at?.slice(0, 10);
    if (byDay[day]) {
      byDay[day].revenue += Number(o.total);
      byDay[day].orders += 1;
    }
  }
  const trend = days.map((d) => byDay[d]);

  // top products by revenue
  const productRevenue = new Map();
  for (const o of revenueOrders) {
    for (const item of o.items || []) {
      const cur = productRevenue.get(item.productId) || {
        name: item.name,
        revenue: 0,
        quantity: 0,
      };
      cur.revenue += item.lineTotal ?? item.price * item.quantity;
      cur.quantity += item.quantity;
      productRevenue.set(item.productId, cur);
    }
  }
  const topProducts = [...productRevenue.entries()]
    .map(([id, v]) => ({ id, ...v }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 8);

  // revenue by category
  const categoryByProduct = new Map(
    (products || []).map((p) => [p.id, p.category?.name || "Uncategorized"]),
  );
  const categoryRevenue = new Map();
  for (const o of revenueOrders) {
    for (const item of o.items || []) {
      const catName = categoryByProduct.get(item.productId) || "Other";
      const lineTotal = item.lineTotal ?? item.price * item.quantity;
      categoryRevenue.set(catName, (categoryRevenue.get(catName) || 0) + lineTotal);
    }
  }
  const revenueByCategory = [...categoryRevenue.entries()].map(([name, revenue]) => ({
    name,
    revenue,
  }));

  // order status breakdown
  const statusCounts = {};
  for (const o of allOrders) {
    statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
  }
  const statusBreakdown = Object.entries(statusCounts).map(([status, count]) => ({
    status,
    count,
  }));

  // customer insights
  const spendByProfile = new Map();
  const ordersByProfile = new Map();
  for (const o of revenueOrders) {
    if (!o.profile_id) continue;
    spendByProfile.set(o.profile_id, (spendByProfile.get(o.profile_id) || 0) + Number(o.total));
    ordersByProfile.set(o.profile_id, (ordersByProfile.get(o.profile_id) || 0) + 1);
  }
  const newCustomers = [...ordersByProfile.values()].filter((c) => c === 1).length;
  const returningCustomers = [...ordersByProfile.values()].filter((c) => c > 1).length;

  const profileMap = new Map((profiles || []).map((p) => [p.id, p]));
  const topCustomers = [...spendByProfile.entries()]
    .map(([id, spend]) => ({
      id,
      spend,
      orders: ordersByProfile.get(id) || 0,
      name: profileMap.get(id)?.name,
      phone: profileMap.get(id)?.phone,
    }))
    .sort((a, b) => b.spend - a.spend)
    .slice(0, 8);

  return {
    revenue,
    orderCount,
    aov,
    trend,
    topProducts,
    revenueByCategory,
    statusBreakdown,
    newCustomers,
    returningCustomers,
    topCustomers,
    totalCustomers: profiles?.length || 0,
  };
}
