"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Heart,
  LogOut,
  Menu,
  Package,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import { formatPrice } from "@/lib/format";
import { getGenericInquiryUrl } from "@/lib/whatsapp";
import { Drawer } from "@/components/ui/drawer";
import { ThemeSwitcher } from "@/components/chrome/theme-switcher";
import { useBazaarLang } from "@/components/theme-bazaar/shared/bazaar-lang";
import { SITE_NAME } from "@/lib/site";

function HeaderInner({ categories = [] }) {
  const pathname = usePathname();
  const router = useRouter();
  const { t, toggle, lang } = useBazaarLang();
  const { itemCount, total, setOrderDrawerOpen, hydrated } = useCart();
  const { user, hydrated: authHydrated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition ${
          scrolled
            ? "border-b border-bazaar-ink/10 bg-bazaar-paper/95 backdrop-blur-md"
            : "bg-bazaar-paper/80"
        }`}
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      >
        <div className="bazaar-container flex h-16 items-center justify-between gap-3">
          <Link href="/" className="focus-ring flex items-center gap-2.5 text-bazaar-ink">
            <span className="relative size-9 overflow-hidden rounded-full">
              <Image src="/images/logo.png" alt="" fill className="object-cover" sizes="36px" />
            </span>
            <span className="font-heading text-xl font-semibold tracking-tight">{SITE_NAME}</span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {categories.slice(0, 3).map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className={`focus-ring text-sm font-medium ${
                  pathname === `/category/${cat.slug}`
                    ? "text-bazaar-wa"
                    : "text-bazaar-ink/70 hover:text-bazaar-ink"
                }`}
              >
                {lang === "ta" ? cat.tamilName : cat.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={toggle}
              className="focus-ring hidden h-10 items-center rounded-full border border-bazaar-ink/15 px-3 text-xs font-semibold text-bazaar-ink sm:inline-flex"
            >
              {t.langToggle}
            </button>

            <Link
              href="/account/favorites"
              aria-label={t.favorites}
              className="focus-ring hidden size-10 items-center justify-center rounded-full text-bazaar-ink hover:bg-bazaar-sand md:flex"
            >
              <Heart className="size-4" />
            </Link>

            <button
              type="button"
              onClick={() => setOrderDrawerOpen(true)}
              className={`focus-ring inline-flex h-10 items-center gap-2 rounded-full px-3 text-sm font-semibold ${
                itemCount > 0
                  ? "bg-bazaar-wa text-white"
                  : "border border-bazaar-ink/15 text-bazaar-ink"
              }`}
            >
              <ShoppingBag className="size-4" />
              <span className="tabular-nums">{hydrated ? itemCount : 0}</span>
              {itemCount > 0 && (
                <span className="hidden tabular-nums sm:inline">{formatPrice(total)}</span>
              )}
            </button>

            {authHydrated && user ? (
              <Link
                href="/account/orders"
                className="focus-ring hidden h-10 items-center gap-2 rounded-full px-3 text-sm font-semibold text-bazaar-ink hover:bg-bazaar-sand md:inline-flex"
              >
                <User className="size-4" />
                {user.name?.split(" ")[0]}
              </Link>
            ) : (
              <Link
                href="/login"
                className="focus-ring hidden h-10 items-center rounded-full px-3 text-sm font-semibold text-bazaar-ink hover:bg-bazaar-sand md:inline-flex"
              >
                {t.login}
              </Link>
            )}

            <div className="hidden md:block">
              <ThemeSwitcher variant="bazaar" />
            </div>

            <button
              type="button"
              className="focus-ring flex size-10 items-center justify-center rounded-full text-bazaar-ink md:hidden"
              aria-label="Menu"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </header>

      <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)} placement="right">
        <div className="flex items-center justify-between border-b border-bazaar-ink/10 px-5 py-4">
          <span className="font-heading text-lg text-bazaar-ink">Menu</span>
          <button
            type="button"
            aria-label="Close"
            className="focus-ring flex size-10 items-center justify-center rounded-full"
            onClick={() => setMobileOpen(false)}
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="flex flex-1 flex-col gap-1 overflow-y-auto bg-bazaar-paper p-4">
          <ThemeSwitcher variant="bazaar" />
          <button
            type="button"
            onClick={toggle}
            className="focus-ring mt-2 rounded-xl border border-bazaar-ink/10 px-4 py-3 text-left text-sm font-semibold"
          >
            {t.langToggle}
          </button>
          {authHydrated && user ? (
            <>
              <p className="px-4 pt-3 text-sm font-semibold text-bazaar-ink">{user.name}</p>
              <Link
                href="/account/orders"
                onClick={() => setMobileOpen(false)}
                className="focus-ring flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium"
              >
                <Package className="size-4" />
                {t.orders}
              </Link>
              <Link
                href="/account/favorites"
                onClick={() => setMobileOpen(false)}
                className="focus-ring flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium"
              >
                <Heart className="size-4" />
                {t.favorites}
              </Link>
              <button
                type="button"
                className="focus-ring flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-red-700"
                onClick={async () => {
                  await logout();
                  setMobileOpen(false);
                  router.push("/");
                }}
              >
                <LogOut className="size-4" />
                {t.logout}
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="focus-ring mt-2 rounded-xl bg-bazaar-sand px-4 py-3 text-sm font-semibold"
            >
              {t.login}
            </Link>
          )}
          <p className="px-4 pt-4 text-xs font-semibold tracking-widest text-bazaar-muted uppercase">
            {t.categories}
          </p>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              onClick={() => setMobileOpen(false)}
              className="focus-ring rounded-xl px-4 py-3 text-sm font-medium"
            >
              {lang === "ta" ? cat.tamilName : cat.name}
            </Link>
          ))}
          <a
            href={getGenericInquiryUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring mt-auto flex h-12 items-center justify-center rounded-full bg-bazaar-wa text-sm font-semibold text-white"
          >
            {t.whatsapp}
          </a>
        </div>
      </Drawer>
    </>
  );
}

export function HeaderBazaar({ categories = [] }) {
  return <HeaderInner categories={categories} />;
}
