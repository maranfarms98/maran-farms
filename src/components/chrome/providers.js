"use client";

import { usePathname } from "next/navigation";
import { CartProvider } from "@/context/cart-context";
import { ToastProvider } from "@/context/toast-context";
import { AuthProvider } from "@/context/auth-context";
import { FavoritesProvider } from "@/context/favorites-context";
import { MotionProvider } from "@/components/motion/motion-provider";
import { Header } from "@/components/chrome/header";
import { Footer } from "@/components/chrome/footer";
import { OrderBar } from "@/components/chrome/order-bar";
import { WhatsAppFAB } from "@/components/chrome/whatsapp-fab";
import { SplashScreen } from "@/components/chrome/splash-screen";
import { LoginModal } from "@/components/auth/login-modal";
import { useViewportHeightSync } from "@/hooks/use-media";

function ViewportHeightSync() {
  useViewportHeightSync();
  return null;
}

export function Providers({ children, categories = [] }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    <MotionProvider>
      <ToastProvider>
        <AuthProvider>
          <FavoritesProvider>
            <CartProvider>
              <ViewportHeightSync />
              {!isAdminRoute && (
                <>
                  <SplashScreen />
                  <Header categories={categories} />
                </>
              )}
              <main className={isAdminRoute ? "flex-1" : "flex min-h-vvh flex-1 flex-col"}>
                {children}
              </main>
              {!isAdminRoute && (
                <>
                  <Footer categories={categories} />
                  <OrderBar />
                  <WhatsAppFAB />
                </>
              )}
              <LoginModal />
            </CartProvider>
          </FavoritesProvider>
        </AuthProvider>
      </ToastProvider>
    </MotionProvider>
  );
}
