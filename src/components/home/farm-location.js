"use client";

import { MapPin, MessageCircle, Navigation } from "lucide-react";
import { MotionReveal } from "@/components/motion/motion-reveal";
import { Pressable } from "@/components/motion/pressable";
import { TamilCaption } from "@/components/ui/tamil-caption";
import {
  FARM_ADDRESS_LINE,
  FARM_ADDRESS_SHORT,
  FARM_CITY,
  FARM_CITY_TA,
  FARM_LOCALITY,
  FARM_LOCALITY_TA,
  GOOGLE_DIRECTIONS_URL,
  GOOGLE_MAPS_EMBED_URL,
  GOOGLE_PLACE_URL,
  SITE_NAME,
} from "@/lib/site";
import { getVisitInquiryUrl } from "@/lib/whatsapp";

export function FarmLocation() {
  return (
    <section className="section-pad bg-farm-cream">
      <div className="container-farm grid items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
        <MotionReveal>
          <p className="text-eyebrow text-farm-green">Our fields</p>
          <h2 className="font-heading text-section mt-3 font-semibold text-farm-green-dark">
            Harvested in {FARM_LOCALITY}, {FARM_CITY}
          </h2>
          <TamilCaption className="mt-2">
            {FARM_LOCALITY_TA}, {FARM_CITY_TA}
          </TamilCaption>
          <div className="mt-5 h-0.5 w-14 bg-farm-accent" aria-hidden />
          <p className="prose-farm mt-5 text-farm-sage">
            Napier sticks leave the plot the morning we pack them. Chicks are
            boxed the morning after hatch. That clock only works because the
            farm is here — a working cattle farm in {FARM_ADDRESS_SHORT}, not a
            warehouse on a highway.
          </p>
          <p className="mt-4 inline-flex items-start gap-2 text-sm font-medium text-farm-green-dark">
            <MapPin className="mt-0.5 size-4 shrink-0 text-farm-accent" />
            <span>{FARM_ADDRESS_LINE}</span>
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Pressable
              as="a"
              href={GOOGLE_DIRECTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring inline-flex h-12 items-center gap-2 rounded-full bg-farm-green px-6 text-button font-semibold text-farm-green-light"
            >
              <Navigation className="size-4" />
              Get directions
            </Pressable>
            <Pressable
              as="a"
              href={getVisitInquiryUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring inline-flex h-12 items-center gap-2 rounded-full border border-farm-green-dark/15 bg-farm-warm px-6 text-button font-semibold text-farm-green"
            >
              <MessageCircle className="size-4" />
              WhatsApp before you visit
            </Pressable>
          </div>
          <a
            href={GOOGLE_PLACE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring mt-4 inline-block text-sm text-farm-accent underline-offset-2 hover:underline"
          >
            View {SITE_NAME} on Google
          </a>
        </MotionReveal>

        <MotionReveal delay={80} className="relative">
          <div className="overflow-hidden rounded-[2rem] border border-farm-green-dark/8 bg-farm-warm shadow-soft">
            <div className="relative aspect-[4/3] min-h-[280px] w-full md:aspect-[16/11]">
              <iframe
                title={`${SITE_NAME}, ${FARM_ADDRESS_SHORT}`}
                src={GOOGLE_MAPS_EMBED_URL}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 size-full border-0 contrast-[1.04] grayscale-[18%]"
                allowFullScreen
              />
              <div
                className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-farm-green-dark/10"
                aria-hidden
              />
              <p className="pointer-events-none absolute top-4 left-4 rounded-full bg-farm-green-dark/90 px-4 py-2 font-heading text-sm text-[#f0d2a8] shadow-elevated">
                {SITE_NAME} · {FARM_CITY_TA}
              </p>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-farm-green-dark/8 bg-farm-warm px-5 py-4">
              <p className="text-sm text-farm-sage">
                Pin: {FARM_LOCALITY}, {FARM_CITY}
              </p>
              <a
                href={GOOGLE_DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring shrink-0 text-sm font-semibold text-farm-green hover:text-farm-accent"
              >
                Open in Maps
              </a>
            </div>
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}
