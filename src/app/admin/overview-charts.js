"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatPrice } from "@/lib/format";

const GREEN = "#15321f";
const ACCENT = "#8b5e3c";
const OCHRE = "#b88e52";
const SAGE = "#8b9b88";
const PIE_COLORS = [GREEN, ACCENT, OCHRE, SAGE, "#0d1e13", "#c9a876"];

function ChartCard({ title, children, className = "" }) {
  return (
    <div className={`rounded-3xl border border-farm-green-dark/8 bg-farm-cream p-5 ${className}`}>
      <p className="mb-4 text-sm font-semibold text-farm-green-dark">{title}</p>
      {children}
    </div>
  );
}

export function StatTiles({ revenue, orderCount, aov, totalCustomers }) {
  const tiles = [
    { label: "Revenue", value: formatPrice(revenue) },
    { label: "Orders", value: orderCount },
    { label: "Avg. Order Value", value: formatPrice(aov) },
    { label: "Customers", value: totalCustomers },
  ];
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {tiles.map((t) => (
        <div
          key={t.label}
          className="rounded-3xl border border-farm-green-dark/8 bg-farm-cream p-5"
        >
          <p className="text-xs font-medium text-farm-sage">{t.label}</p>
          <p className="mt-2 font-heading text-2xl text-farm-green-dark">{t.value}</p>
        </div>
      ))}
    </div>
  );
}

export function RevenueTrendChart({ data }) {
  return (
    <ChartCard title="Revenue — Last 30 Days" className="lg:col-span-2">
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={GREEN} stopOpacity={0.35} />
              <stop offset="100%" stopColor={GREEN} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#15321f10" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: SAGE }} />
          <YAxis tick={{ fontSize: 11, fill: SAGE }} width={40} />
          <Tooltip formatter={(v) => formatPrice(v)} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke={GREEN}
            fill="url(#revenueFill)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function TopProductsChart({ data }) {
  return (
    <ChartCard title="Top Products by Revenue">
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} layout="vertical" margin={{ left: 24 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#15321f10" />
          <XAxis type="number" tick={{ fontSize: 11, fill: SAGE }} />
          <YAxis
            type="category"
            dataKey="name"
            width={110}
            tick={{ fontSize: 11, fill: SAGE }}
          />
          <Tooltip formatter={(v) => formatPrice(v)} />
          <Bar dataKey="revenue" fill={ACCENT} radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function RevenueByCategoryChart({ data }) {
  return (
    <ChartCard title="Revenue by Category">
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            dataKey="revenue"
            nameKey="name"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(v) => formatPrice(v)} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function OrderStatusChart({ data }) {
  return (
    <ChartCard title="Order Status Breakdown">
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="status"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function CustomerInsights({ newCustomers, returningCustomers, topCustomers }) {
  return (
    <ChartCard title="Customer Insights" className="lg:col-span-2">
      <div className="mb-5 grid grid-cols-2 gap-4">
        <div className="rounded-2xl bg-farm-warm p-4">
          <p className="text-xs text-farm-sage">New Customers</p>
          <p className="mt-1 font-heading text-2xl text-farm-green-dark">{newCustomers}</p>
        </div>
        <div className="rounded-2xl bg-farm-warm p-4">
          <p className="text-xs text-farm-sage">Returning Customers</p>
          <p className="mt-1 font-heading text-2xl text-farm-green-dark">{returningCustomers}</p>
        </div>
      </div>
      <p className="mb-2 text-xs font-semibold text-farm-sage">Top Spenders</p>
      <ul className="space-y-2">
        {topCustomers.map((c) => (
          <li
            key={c.id}
            className="flex items-center justify-between rounded-2xl bg-farm-warm px-4 py-2.5 text-sm"
          >
            <span className="text-farm-green-dark">
              {c.name || "Unknown"} <span className="text-farm-sage">· {c.phone}</span>
            </span>
            <span className="tabular-nums font-semibold text-farm-green">
              {formatPrice(c.spend)}
            </span>
          </li>
        ))}
        {topCustomers.length === 0 && (
          <p className="text-sm text-farm-sage">No customer data yet.</p>
        )}
      </ul>
    </ChartCard>
  );
}
