"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  Leaf,
  LogOut,
  Menu,
  Package,
  ShieldCheck,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import { formatPrice } from "@/lib/format";
import { getGenericInquiryUrl } from "@/lib/whatsapp";
import { Drawer } from "@/components/ui/drawer";
import { Spinner } from "@/components/ui/spinner";
import { useMotionAllowed } from "@/components/motion/motion-provider";
import { ThemeSwitcher } from "@/components/chrome/theme-switcher";

function AccountMenuCanopy() {
  const { user, hydrated, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, [open]);

  if (!hydrated) return <div className="hidden h-11 w-24 md:block" />;

  if (!user) {
    return (
      <Link
        href="/login"
        className="focus-ring hidden h-11 items-center gap-2 rounded-full bg-canopy-moss/40 px-4 text-sm font-semibold text-canopy-mist backdrop-blur-sm md:inline-flex"
      >
        <User className="size-4" />
        Login
      </Link>
    );
  }

  return (
    <div className="relative hidden md:block" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="focus-ring inline-flex h-11 items-center gap-2 rounded-full bg-canopy-moss/40 px-4 text-sm font-semibold text-canopy-mist backdrop-blur-sm"
      >
        <User className="size-4" />
        {user.name?.split(" ")[0]}
        <ChevronDown className={`size-4 transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full right-0 z-50 mt-3 w-56 rounded-3xl border border-canopy-leaf-light/20 bg-canopy-deep p-2 shadow-elevated"
        >
          <Link
            href="/account/orders"
            className="focus-ring flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-canopy-mist hover:bg-canopy-moss/30"
            onClick={() => setOpen(false)}
          >
            <Package className="size-4" />
            My Orders
          </Link>
          {user.isAdmin && (
            <Link
              href="/admin"
              className="focus-ring flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-canopy-mist hover:bg-canopy-moss/30"
              onClick={() => setOpen(false)}
            >
              <ShieldCheck className="size-4" />
              Admin Dashboard
            </Link>
          )}
          <button
            type="button"
            disabled={loggingOut}
            onClick={async () => {
              setLoggingOut(true);
              await logout();
              router.push("/");
            }}
            className="focus-ring flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium text-canopy-gold-light hover:bg-canopy-moss/30 disabled:opacity-60"
          >
            {loggingOut ? <Spinner className="size-4" /> : <LogOut className="size-4" />}
            {loggingOut ? "Logging out…" : "Logout"}
          </button>
        </motion.div>
      )}
    </div>
  );
}

function MobileAccountLinksCanopy({ onNavigate }) {
  const { user, hydrated, logout } = useAuth();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  if (!hydrated) return null;

  if (!user) {
    return (
      <Link
        href="/login"
        onClick={onNavigate}
        className="focus-ring mb-2 flex items-center gap-3 rounded-2xl bg-canopy-moss/30 px-4 py-3 font-medium text-canopy-mist"
      >
        <User className="size-4" />
        Login
      </Link>
    );
  }

  return (
    <div className="mb-2 rounded-2xl bg-canopy-moss/30 p-1">
      <p className="px-3 py-2 text-sm font-semibold text-canopy-mist">{user.name}</p>
      <Link
        href="/account/orders"
        className="focus-ring flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-canopy-mist hover:bg-canopy-moss/40"
        onClick={onNavigate}
      >
        <Package className="size-4" />
        My Orders
      </Link>
      {user.isAdmin && (
        <Link
          href="/admin"
          className="focus-ring flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-canopy-mist hover:bg-canopy-moss/40"
          onClick={onNavigate}
        >
          <ShieldCheck className="size-4" />
          Admin Dashboard
        </Link>
      )}
      <button
        type="button"
        disabled={loggingOut}
        onClick={async () => {
          setLoggingOut(true);
          await logout();
          onNavigate();
          router.push("/");
        }}
        className="focus-ring flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium text-canopy-gold-light hover:bg-canopy-moss/40 disabled:opacity-60"
      >
        {loggingOut ? <Spinner className="size-4" /> : <LogOut className="size-4" />}
        {loggingOut ? "Logging out…" : "Logout"}
      </button>
    </div>
  );
}

export function HeaderCanopy({ categories = [] }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartPulse, setCartPulse] = useState(false);
  const [menuPath, setMenuPath] = useState(pathname);
  const catalogRef = useRef(null);
  const { itemCount, total, pulse, setOrderDrawerOpen, hydrated } = useCart();
  const prevPulse = useRef(pulse);
  const motionAllowed = useMotionAllowed();

  if (pathname !== menuPath) {
    setMenuPath(pathname);
    setCatalogOpen(false);
    setMobileOpen(false);
  }

  const transparent = isHome && !scrolled && !mobileOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (pulse === prevPulse.current) return;
    prevPulse.current = pulse;
    const start = window.setTimeout(() => setCartPulse(true), 0);
    const end = window.setTimeout(() => setCartPulse(false), 450);
    return () => {
      window.clearTimeout(start);
      window.clearTimeout(end);
    };
  }, [pulse]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setCatalogOpen(false);
        setMobileOpen(false);
      }
    };
    const onClick = (e) => {
      if (catalogRef.current && !catalogRef.current.contains(e.target)) {
        setCatalogOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, []);

  return (
    <motion.header
      className={`fixed inset-x-0 top-0 z-50 text-canopy-mist ${
        transparent
          ? "bg-transparent"
          : "border-b border-canopy-leaf-light/10 bg-canopy-forest/85 shadow-soft backdrop-blur-md"
      }`}
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <div
        className={`container-farm flex items-center justify-between gap-3 ${
          transparent ? "h-[4.5rem]" : "h-[3.75rem]"
        }`}
      >
        <Link href="/" className="focus-ring group flex items-center gap-2.5">
          <span className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full shadow-soft ring-2 ring-canopy-leaf/40 transition group-hover:rotate-12">
            <Image src="/images/logo.png" alt="Maran Farms" fill className="object-cover" sizes="40px" />
          </span>
          <span className="font-heading flex items-center gap-1.5 text-lg tracking-tight sm:text-xl">
            <Leaf className="size-4 text-canopy-leaf-light animate-canopy-drift" />
            Maran Farms
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/" className="focus-ring py-1 text-sm font-medium">
            Home
          </Link>
          <div className="relative" ref={catalogRef}>
            <button
              type="button"
              className="focus-ring inline-flex items-center gap-1 py-1 text-sm font-medium"
              aria-expanded={catalogOpen}
              onClick={() => setCatalogOpen((o) => !o)}
            >
              Our Catalog
              <ChevronDown className={`size-4 transition ${catalogOpen ? "rotate-180" : ""}`} />
            </button>
            {catalogOpen && (
              <motion.div
                initial={motionAllowed ? { opacity: 0, y: -8 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22 }}
                className="absolute top-full left-1/2 z-50 mt-3 w-72 -translate-x-1/2 rounded-3xl border border-canopy-leaf-light/20 bg-canopy-deep p-2 shadow-elevated"
              >
                <p className="px-4 pt-2 pb-1 text-eyebrow text-canopy-leaf-light">Categories</p>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    className="focus-ring block rounded-2xl px-4 py-3 transition hover:bg-canopy-moss/30"
                  >
                    <span className="block font-medium text-canopy-mist">{cat.name}</span>
                    <span className="text-xs text-canopy-gold-light" lang="ta">
                      {cat.tamilName}
                    </span>
                  </Link>
                ))}
              </motion.div>
            )}
          </div>
        </nav>

        <div className="flex items-center gap-2">
          <motion.button
            type="button"
            onClick={() => setOrderDrawerOpen(true)}
            animate={cartPulse && motionAllowed ? { scale: [1, 1.08, 1], y: [0, -2, 0] } : { scale: 1 }}
            transition={{ duration: 0.4 }}
            className={`focus-ring inline-flex h-11 items-center gap-2 rounded-full px-3 text-sm font-semibold sm:px-4 ${
              itemCount > 0 ? "bg-canopy-gold text-canopy-forest" : "bg-canopy-moss/40 text-canopy-mist"
            }`}
          >
            <ShoppingBag className="size-4" />
            <span className="tabular-nums">{hydrated ? itemCount : 0}</span>
            <span className="hidden min-[400px]:inline">Item{itemCount === 1 ? "" : "s"}</span>
            {itemCount > 0 && (
              <>
                <span className="hidden h-4 w-px bg-current/30 sm:block" />
                <span className="hidden tabular-nums sm:inline">{formatPrice(total)}</span>
              </>
            )}
          </motion.button>

          <a
            href={getGenericInquiryUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring hidden h-11 items-center rounded-full bg-canopy-leaf px-5 text-button font-semibold text-canopy-forest transition hover:bg-canopy-leaf-light md:inline-flex"
          >
            WhatsApp Booking
          </a>

          <AccountMenuCanopy />

          <div className="hidden md:block">
            <ThemeSwitcher variant="canopy" />
          </div>

          <button
            type="button"
            className="focus-ring flex size-11 items-center justify-center rounded-full md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)} placement="right">
        <div className="flex items-center justify-between border-b border-canopy-leaf-light/15 bg-canopy-deep px-5 py-4">
          <span className="font-heading text-lg text-canopy-mist">Menu</span>
          <button
            type="button"
            aria-label="Close menu"
            className="focus-ring flex size-11 items-center justify-center rounded-full text-canopy-mist hover:bg-canopy-moss/30"
            onClick={() => setMobileOpen(false)}
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="flex flex-1 flex-col space-y-1 overflow-y-auto bg-canopy-deep p-4">
          <div className="mb-2">
            <ThemeSwitcher variant="canopy" />
          </div>
          <MobileAccountLinksCanopy onNavigate={() => setMobileOpen(false)} />
          <Link
            href="/"
            className="focus-ring block rounded-2xl px-4 py-3 font-medium text-canopy-mist hover:bg-canopy-moss/30"
            onClick={() => setMobileOpen(false)}
          >
            Home
          </Link>
          <p className="text-eyebrow px-4 pt-3 pb-1 text-canopy-leaf-light">Categories</p>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="focus-ring block rounded-2xl px-4 py-3 text-canopy-mist hover:bg-canopy-moss/30"
              onClick={() => setMobileOpen(false)}
            >
              <span className="block font-medium">{cat.name}</span>
              <span className="text-xs text-canopy-gold-light" lang="ta">
                {cat.tamilName}
              </span>
            </Link>
          ))}
          <a
            href={getGenericInquiryUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring mt-auto flex h-12 w-full items-center justify-center rounded-full bg-canopy-leaf text-button font-semibold text-canopy-forest"
            onClick={() => setMobileOpen(false)}
          >
            WhatsApp Order
          </a>
        </div>
      </Drawer>
    </motion.header>
  );
}
