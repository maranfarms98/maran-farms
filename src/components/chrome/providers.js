"use client";

import { CartProvider } from "@/context/cart-context";
import { ToastProvider } from "@/context/toast-context";
import { MotionProvider } from "@/components/motion/motion-provider";
import { Header } from "@/components/chrome/header";
import { Footer } from "@/components/chrome/footer";
import { OrderBar } from "@/components/chrome/order-bar";
import { WhatsAppFAB } from "@/components/chrome/whatsapp-fab";
import { SplashScreen } from "@/components/chrome/splash-screen";
import { useViewportHeightSync } from "@/hooks/use-media";

function ViewportHeightSync() {
  useViewportHeightSync();
  return null;
}

export function Providers({ children }) {
  return (
    <MotionProvider>
      <ToastProvider>
        <CartProvider>
          <ViewportHeightSync />
          <SplashScreen />
          <Header />
          <main className="flex min-h-vvh flex-1 flex-col">{children}</main>
          <Footer />
          <OrderBar />
          <WhatsAppFAB />
        </CartProvider>
      </ToastProvider>
    </MotionProvider>
  );
}
