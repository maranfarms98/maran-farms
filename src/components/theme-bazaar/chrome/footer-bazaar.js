"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import {
  CONTACT_EMAIL,
  INSTAGRAM_URL,
  SITE_NAME,
  WHATSAPP_DISPLAY,
} from "@/lib/site";
import { getGenericInquiryUrl } from "@/lib/whatsapp";
import { useBazaarLang } from "@/components/theme-bazaar/shared/bazaar-lang";

export function FooterBazaar({ categories = [] }) {
  const { t, lang } = useBazaarLang();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-bazaar-ink/10 bg-bazaar-soil text-bazaar-paper">
      <div className="bazaar-container grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-heading text-2xl font-semibold">{SITE_NAME}</p>
          <p className="mt-3 max-w-xs text-sm text-bazaar-paper/70">
            {lang === "ta"
              ? "நேப்பியர், குஞ்சுகள், செல்லப்பிராணிகள் — வாட்ஸ்அப் வழியாக ஆர்டர்."
              : "Napier, chicks & pets — order fast on WhatsApp across Tamil Nadu."}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-widest text-bazaar-paper/50 uppercase">
            {t.shop}
          </p>
          <ul className="mt-3 space-y-2">
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link
                  href={`/category/${cat.slug}`}
                  className="text-sm text-bazaar-paper/80 hover:text-white"
                >
                  {lang === "ta" ? cat.tamilName : cat.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/account/favorites" className="text-sm text-bazaar-paper/80 hover:text-white">
                {t.favorites}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-widest text-bazaar-paper/50 uppercase">
            Account
          </p>
          <ul className="mt-3 space-y-2 text-sm text-bazaar-paper/80">
            <li>
              <Link href="/account/orders" className="hover:text-white">
                {t.orders}
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-white">
                {t.login}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-widest text-bazaar-paper/50 uppercase">
            Contact
          </p>
          <a
            href={getGenericInquiryUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-bazaar-wa-bright"
          >
            <MessageCircle className="size-4" />
            {WHATSAPP_DISPLAY}
          </a>
          <p className="mt-2 text-sm text-bazaar-paper/70">{CONTACT_EMAIL}</p>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 block text-sm text-bazaar-paper/70 hover:text-white"
          >
            Instagram
          </a>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-bazaar-paper/45">
        © {year} {SITE_NAME}
      </div>
    </footer>
  );
}
