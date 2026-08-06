import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  LayoutDashboard,
  ListOrdered,
  Package,
  Tags,
  Users,
} from "lucide-react";
import { getSessionFromCookies } from "@/lib/auth/session";
import { AdminLogoutButton } from "@/app/admin/logout-button";

// Admin reads cookies + Supabase; never statically prerender without env.
export const dynamic = "force-dynamic";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ListOrdered },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/customers", label: "Customers", icon: Users },
];

export default async function AdminLayout({ children }) {
  const session = await getSessionFromCookies();

  // Defense in depth — middleware already gates /admin/**, this re-checks.
  if (!session?.isAdmin) redirect("/");

  return (
    <div className="flex min-h-screen bg-farm-warm">
      <aside className="hidden w-64 shrink-0 border-r border-farm-green-dark/8 bg-farm-cream px-4 py-8 md:block">
        <div className="flex items-center gap-3 px-3">
          <span className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full">
            <Image src="/images/logo.png" alt="" fill className="object-cover" sizes="40px" />
          </span>
          <div>
            <p className="font-heading text-xl text-farm-green-dark">Maran Farms</p>
            <p className="text-sm text-farm-sage">Admin · {session.name}</p>
          </div>
        </div>
        <nav className="mt-8 flex flex-col gap-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="focus-ring flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-farm-green-dark hover:bg-farm-accent-light"
            >
              <Icon className="size-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="mt-8 flex flex-col gap-1 border-t border-farm-green-dark/8 pt-4">
          <Link
            href="/"
            className="focus-ring flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-farm-sage hover:bg-farm-accent-light"
          >
            <ArrowLeft className="size-4" />
            Back to storefront
          </Link>
          <AdminLogoutButton />
        </div>
      </aside>

      <div className="flex-1 overflow-x-hidden">
        <nav className="flex items-center gap-1 overflow-x-auto border-b border-farm-green-dark/8 bg-farm-cream px-4 py-3 md:hidden">
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="focus-ring shrink-0 rounded-full px-4 py-2 text-sm font-medium text-farm-green-dark hover:bg-farm-accent-light"
            >
              {label}
            </Link>
          ))}
          <span className="mx-1 h-6 w-px shrink-0 bg-farm-green-dark/10" />
          <Link
            href="/"
            className="focus-ring shrink-0 rounded-full px-4 py-2 text-sm font-medium text-farm-sage hover:bg-farm-accent-light"
          >
            ← Storefront
          </Link>
          <AdminLogoutButton className="focus-ring shrink-0 flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-farm-accent hover:bg-farm-accent-light disabled:opacity-60" />
        </nav>
        <main className="px-4 py-8 md:px-8">{children}</main>
      </div>
    </div>
  );
}
