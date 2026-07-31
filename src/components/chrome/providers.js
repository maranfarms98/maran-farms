"use client";

import { usePathname } from "next/navigation";
import { CartProvider } from "@/context/cart-context";
import { ToastProvider } from "@/context/toast-context";
import { AuthProvider } from "@/context/auth-context";
import { FavoritesProvider } from "@/context/favorites-context";
import { ThemeProvider, useTheme } from "@/context/theme-context";
import { MotionProvider } from "@/components/motion/motion-provider";
import { Header } from "@/components/chrome/header";
import { Footer } from "@/components/chrome/footer";
import { OrderBar } from "@/components/chrome/order-bar";
import { WhatsAppFAB } from "@/components/chrome/whatsapp-fab";
import { SplashScreen } from "@/components/chrome/splash-screen";
import { LoginModal } from "@/components/auth/login-modal";
import { useViewportHeightSync } from "@/hooks/use-media";
import { HeaderCanopy } from "@/components/theme-canopy/chrome/header-canopy";
import { FooterCanopy } from "@/components/theme-canopy/chrome/footer-canopy";
import { OrderBarCanopy } from "@/components/theme-canopy/chrome/order-bar-canopy";
import { WhatsAppFabCanopy } from "@/components/theme-canopy/chrome/whatsapp-fab-canopy";

function ViewportHeightSync() {
  useViewportHeightSync();
  return null;
}

function Chrome({ children, categories }) {
  const pathname = usePathname();
  const { theme } = useTheme();
  const isAdminRoute = pathname?.startsWith("/admin");
  const isCheckoutRoute = pathname?.startsWith("/checkout") || pathname?.startsWith("/login");
  const showCanopyChrome = theme === "canopy" && !isAdminRoute && !isCheckoutRoute;

  return (
    <>
      <ViewportHeightSync />
      {!isAdminRoute && (
        <>
          <SplashScreen />
          {showCanopyChrome ? (
            <HeaderCanopy categories={categories} />
          ) : (
            <Header categories={categories} />
          )}
        </>
      )}
      <main className={isAdminRoute ? "flex-1" : "flex min-h-vvh flex-1 flex-col"}>
        {children}
      </main>
      {!isAdminRoute && (
        <>
          {showCanopyChrome ? (
            <FooterCanopy categories={categories} />
          ) : (
            <Footer categories={categories} />
          )}
          {showCanopyChrome ? <OrderBarCanopy /> : <OrderBar />}
          {showCanopyChrome ? <WhatsAppFabCanopy /> : <WhatsAppFAB />}
        </>
      )}
      <LoginModal />
    </>
  );
}

export function Providers({ children, categories = [], initialTheme = "classic" }) {
  return (
    <ThemeProvider initialTheme={initialTheme}>
      <MotionProvider>
        <ToastProvider>
          <AuthProvider>
            <FavoritesProvider>
              <CartProvider>
                <Chrome categories={categories}>{children}</Chrome>
              </CartProvider>
            </FavoritesProvider>
          </AuthProvider>
        </ToastProvider>
      </MotionProvider>
    </ThemeProvider>
  );
}
