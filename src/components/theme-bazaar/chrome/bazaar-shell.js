"use client";

import { BazaarLangProvider } from "@/components/theme-bazaar/shared/bazaar-lang";

/** Wraps bazaar chrome + page content so EN/TA copy stays in sync */
export function BazaarShell({ children }) {
  return (
    <BazaarLangProvider>
      <div className="theme-bazaar flex min-h-vvh flex-1 flex-col">{children}</div>
    </BazaarLangProvider>
  );
}
