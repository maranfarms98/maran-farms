import { getAnalytics } from "@/lib/analytics";
import {
  StatTiles,
  RevenueTrendChart,
  TopProductsChart,
  RevenueByCategoryChart,
  OrderStatusChart,
  CustomerInsights,
} from "@/app/admin/overview-charts";

export default async function AdminOverviewPage() {
  const analytics = await getAnalytics();

  return (
    <div>
      <h1 className="font-heading text-3xl text-farm-green-dark">Overview</h1>
      <p className="mt-1 text-sm text-farm-sage">
        Revenue and order performance at a glance.
      </p>

      <div className="mt-6">
        <StatTiles
          revenue={analytics.revenue}
          orderCount={analytics.orderCount}
          aov={analytics.aov}
          totalCustomers={analytics.totalCustomers}
        />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <RevenueTrendChart data={analytics.trend} />
        <TopProductsChart data={analytics.topProducts} />
        <RevenueByCategoryChart data={analytics.revenueByCategory} />
        <OrderStatusChart data={analytics.statusBreakdown} />
        <CustomerInsights
          newCustomers={analytics.newCustomers}
          returningCustomers={analytics.returningCustomers}
          topCustomers={analytics.topCustomers}
        />
      </div>
    </div>
  );
}
