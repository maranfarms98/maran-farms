"use client";

import Image from "next/image";
import { CheckCheck, QrCode } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { TamilCaption } from "@/components/ui/tamil-caption";
import { MotionReveal } from "@/components/motion/motion-reveal";
import { Pressable } from "@/components/motion/pressable";
import { getGenericInquiryUrl } from "@/lib/whatsapp";
import { WHATSAPP_DISPLAY, WHATSAPP_NUMBER } from "@/lib/site";
import { useMotionAllowed } from "@/components/motion/motion-provider";

const STEPS = ["Select items & quantity", "Tap to Order Now", "Confirm & Finalize", "Receive Fresh Harvest"];

const MESSAGES = [
  { from: "user", text: "Hi! Do you have Red Napier sticks in stock?" },
  { from: "farm", text: "Yes — fresh Red Napier available. How many sticks do you need?" },
  { from: "user", text: "1,000 sticks delivered to Coimbatore please." },
  { from: "farm", text: "Confirmed. We'll dispatch tomorrow morning with care packing." },
  { from: "farm", text: "", image: true },
  { from: "user", text: "Perfect — booking confirmed. Thank you!" },
];

export function WhatsAppSectionCanopy() {
  const motionAllowed = useMotionAllowed();
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.25 });

  return (
    <section ref={sectionRef} className="section-pad border-t border-canopy-leaf-light/10 bg-canopy-deep">
      <div className="container-farm">
        <div className="grid min-w-0 items-center gap-12 lg:grid-cols-2">
          <MotionReveal>
            <p className="text-eyebrow text-canopy-gold-light">Instant Ordering Handoff</p>
            <h2 className="font-heading text-section mt-3 font-semibold text-canopy-mist">
              Order Instantly
              <br />
              <span className="text-canopy-leaf-light">Through WhatsApp</span>
            </h2>
            <TamilCaption tone="light" className="mt-2">
              வாட்ஸ்அப் மூலம் உடனடி ஆர்டர்
            </TamilCaption>
            <p className="prose-farm mt-4 text-canopy-mist/75">
              No carts to abandon, no payment gateways — build your list on the
              site, then finalize availability and delivery in a direct chat
              with our farm team.
            </p>

            <ol className="mt-8 grid grid-cols-2 gap-3">
              {STEPS.map((step, i) => (
                <li key={step} className="rounded-2xl border border-canopy-leaf-light/15 bg-canopy-forest/50 p-4">
                  <span className="font-heading text-2xl text-canopy-gold-light">0{i + 1}</span>
                  <p className="mt-1 text-sm font-medium text-canopy-mist">{step}</p>
                </li>
              ))}
            </ol>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Pressable
                as="a"
                href={getGenericInquiryUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring inline-flex h-12 items-center rounded-full bg-canopy-leaf px-6 text-button font-semibold text-canopy-forest"
              >
                Start Direct Chat
              </Pressable>
              <div className="inline-flex items-center gap-2 rounded-full border border-canopy-leaf-light/15 bg-canopy-forest/50 px-4 py-2 text-sm text-canopy-mist">
                <QrCode className="size-4 shrink-0 text-canopy-gold-light" />
                <span>
                  Scan to Order ·{" "}
                  <a
                    href={`tel:+${WHATSAPP_NUMBER}`}
                    className="font-semibold underline-offset-2 hover:underline"
                  >
                    {WHATSAPP_DISPLAY}
                  </a>
                </span>
              </div>
            </div>
          </MotionReveal>

          <MotionReveal variant="right" className="flex min-w-0 justify-center">
            <div className="relative w-full max-w-[320px] rounded-[2.5rem] border-[6px] border-canopy-forest bg-canopy-mist shadow-elevated">
              <div className="mx-auto mt-2 h-5 w-28 rounded-full bg-canopy-forest" />
              <div className="flex items-center justify-between px-5 pt-2 pb-1 text-[0.65rem] text-canopy-bark/70">
                <span>10:35</span>
                <span>LTE · ████</span>
              </div>
              <div className="flex items-center gap-3 border-b border-canopy-forest/10 bg-canopy-forest px-4 py-3 text-canopy-mist">
                <span className="flex size-9 items-center justify-center rounded-full bg-canopy-gold text-xs font-bold text-canopy-forest">
                  MF
                </span>
                <div>
                  <p className="text-sm font-semibold">Maran Farms</p>
                  <p className="text-[0.65rem] text-canopy-mist/70">Online · Support & Ordering</p>
                </div>
              </div>

              <div className="flex h-[28rem] flex-col gap-2 overflow-hidden bg-canopy-leaf-light/20 p-3">
                <div className="mx-auto max-w-[90%] rounded-lg bg-canopy-gold-light/60 px-3 py-2 text-center text-[0.65rem] text-canopy-forest/80">
                  Messages are end-to-end simulated for demo. Real orders open
                  in WhatsApp.
                </div>
                {MESSAGES.map((m, i) => {
                  const show = !motionAllowed || inView;
                  return (
                    <motion.div
                      key={i}
                      initial={motionAllowed ? { opacity: 0, y: 10, scale: 0.96 } : false}
                      animate={show ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 10 }}
                      transition={{ delay: motionAllowed && inView ? 0.35 + i * 0.55 : 0, duration: 0.35 }}
                      className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                        m.from === "farm"
                          ? "self-start rounded-tl-sm bg-canopy-leaf/70 text-canopy-forest"
                          : "self-end rounded-tr-sm bg-white text-canopy-forest"
                      }`}
                    >
                      {m.image ? (
                        <div className="relative mb-1 aspect-video w-40 overflow-hidden rounded-lg">
                          <Image
                            src="/images/product-napier.png"
                            alt="Harvest photo"
                            fill
                            className="object-cover"
                            sizes="160px"
                          />
                        </div>
                      ) : (
                        <p>{m.text}</p>
                      )}
                      <span className="mt-1 flex items-center justify-end gap-0.5 text-[0.6rem] text-canopy-forest/60">
                        10:3{i}
                        {m.from === "user" && <CheckCheck className="size-3 text-sky-600" />}
                      </span>
                    </motion.div>
                  );
                })}
              </div>

              <div className="border-t border-canopy-forest/10 bg-canopy-mist px-4 py-3">
                <div className="rounded-full bg-white px-4 py-2.5 text-sm text-canopy-bark/60">
                  Type message here...
                </div>
              </div>
            </div>
          </MotionReveal>
        </div>
      </div>
    </section>
  );
}
