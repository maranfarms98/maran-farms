"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Leaf, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/context/toast-context";
import {
  CONTACT_EMAIL,
  INSTAGRAM_URL,
  WHATSAPP_DISPLAY,
} from "@/lib/site";
import { getGenericInquiryUrl } from "@/lib/whatsapp";
import { TamilCaption } from "@/components/ui/tamil-caption";
import { InstagramIcon } from "@/components/ui/instagram-icon";
import { MotionReveal } from "@/components/motion/motion-reveal";

export function Footer({ categories = [] }) {
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const year = new Date().getFullYear();

  const onSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast("Thank you! You've subscribed to our farm newsletters.");
    setEmail("");
  };

  return (
    <footer className="grain-overlay relative overflow-hidden bg-dark-diagonal text-farm-green-light">
      <Leaf
        className="pointer-events-none absolute -top-8 -left-8 size-40 rotate-12 text-white/5"
        strokeWidth={1}
      />
      <Leaf
        className="pointer-events-none absolute -right-6 -bottom-10 size-48 -rotate-12 text-white/5"
        strokeWidth={1}
      />

      <div className="relative z-10">
        <MotionReveal className="container-farm border-b border-white/10 py-12 md:py-16">
          <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-end">
            <div>
              <p className="text-eyebrow text-farm-ochre">Weekly Farm Diary</p>
              <h2 className="font-heading mt-3 text-section text-white">
                Stay connected with our fresh farm harvests.
              </h2>
              <p className="mt-3 max-w-md text-farm-green-light/75">
                Occasional notes on fodder cycles, chick batches, and farm life
                across Tamil Nadu.
              </p>
            </div>
            <form onSubmit={onSubmit} className="flex gap-2">
              <label className="sr-only" htmlFor="newsletter-email">
                Email
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="focus-ring h-14 flex-1 rounded-full border border-white/15 bg-white/10 px-5 text-white placeholder:text-white/45"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="focus-ring flex size-14 shrink-0 items-center justify-center rounded-full bg-farm-accent text-white transition hover:bg-farm-accent-dark"
              >
                <ArrowUpRight className="size-5" />
              </button>
            </form>
          </div>
        </MotionReveal>

        <div className="container-farm grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full">
                <Image src="/images/logo.png" alt="Maran Farms" fill className="object-cover" sizes="40px" />
              </span>
              <span className="font-heading text-xl text-white">Maran Farms</span>
            </div>
            <p className="mt-4 text-sm text-farm-green-light/75">
              Family-owned agricultural excellence — Napier plants, farm-fresh
              chicks, and healthy small pets delivered across Tamil Nadu.
            </p>
            <p className="mt-5 text-sm italic text-farm-ochre" lang="ta">
              விதைத்தால் விளையும்; உழைத்தால் உயரும்.
            </p>
            <TamilCaption tone="muted" className="mt-1">
              Sow with care, rise with labour.
            </TamilCaption>
          </div>

          <div>
            <h3 className="text-eyebrow text-farm-ochre">Our Products</h3>
            <ul className="mt-4 space-y-3">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="focus-ring group block rounded-lg"
                  >
                    <span className="block text-white transition group-hover:text-farm-ochre">
                      {cat.name}
                    </span>
                    <span className="text-xs text-farm-green-light/70" lang="ta">
                      {cat.tamilName}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-eyebrow text-farm-ochre">Working Hours</h3>
            <p className="mt-4 text-white">Daily Operations</p>
            <p className="text-farm-green-light/75">8:00 AM–6:00 PM</p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="focus-ring mt-4 inline-block text-sm text-farm-ochre hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
          </div>

          <div>
            <h3 className="text-eyebrow text-farm-ochre">Direct Contact</h3>
            <p className="mt-4 text-farm-green-light/75">Tamil Nadu, India</p>
            <a
              href={getGenericInquiryUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring mt-3 inline-flex items-center gap-2 text-white hover:text-farm-ochre"
            >
              <MessageCircle className="size-4" />
              WhatsApp {WHATSAPP_DISPLAY}
            </a>
            <p className="mt-4 text-sm text-farm-green-light/70">
              Social & Trust Proof — 2,000+ followers · 500+ WhatsApp orders
            </p>
          </div>
        </div>

        <div className="container-farm flex flex-col gap-4 border-t border-white/10 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-farm-green-light/55">
            © {year} Maran Farms. Handcrafted for agricultural excellence.
          </p>
          <div className="flex gap-3">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="focus-ring flex size-11 items-center justify-center rounded-full border border-white/15 text-white transition hover:bg-white/10"
            >
              <InstagramIcon className="size-5" />
            </a>
            <a
              href={getGenericInquiryUrl()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="focus-ring flex size-11 items-center justify-center rounded-full border border-white/15 text-white transition hover:bg-white/10"
            >
              <MessageCircle className="size-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
