import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import {
  CONTACT_EMAIL,
  FARM_ADDRESS_LINE,
  SITE_NAME,
  WHATSAPP_DISPLAY,
} from "@/lib/site";

const crumbs = [
  { name: "Home", href: "/" },
  { name: "Terms of Service", href: "/terms-of-service" },
];

const LAST_UPDATED = "25 August 2026";

export const metadata = pageMetadata({
  title: "Terms of Service | Maran Farms",
  description:
    "Terms of service for using the Maran Farms website, placing orders, and contacting us for Napier grass, chicks, and small pets.",
  path: "/terms-of-service",
});

function Section({ title, children }) {
  return (
    <section>
      <h2 className="font-heading mt-10 text-2xl text-farm-green-dark md:text-3xl">
        {title}
      </h2>
      {children}
    </section>
  );
}

function P({ children }) {
  return (
    <p className="mt-4 text-base leading-relaxed break-words text-farm-sage">
      {children}
    </p>
  );
}

function Ul({ children }) {
  return (
    <ul className="mt-4 list-disc space-y-2 pl-5 text-farm-sage">{children}</ul>
  );
}

function Li({ children }) {
  return <li className="leading-relaxed">{children}</li>;
}

export default function TermsOfServicePage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <article className="container-farm max-w-3xl pt-24 pb-24 md:pt-28 md:pb-20">
        <Breadcrumbs items={crumbs} />
        <p className="text-eyebrow mt-8 text-farm-sage">Legal</p>
        <h1 className="font-heading mt-2 text-[1.65rem] leading-tight text-farm-green-dark md:text-4xl">
          Terms of Service
        </h1>
        <p className="mt-3 text-sm text-farm-sage">Last updated: {LAST_UPDATED}</p>

        <div className="mt-8">
          <P>
            These Terms of Service (&ldquo;Terms&rdquo;) govern your use of the{" "}
            {SITE_NAME} website at{" "}
            <Link
              href="/"
              className="font-medium text-farm-green underline-offset-2 hover:text-farm-accent hover:underline"
            >
              www.maranfarms.com
            </Link>{" "}
            and any related ordering or login flows (including Facebook or
            Instagram login where offered). By using our site or placing an
            order, you agree to these Terms.
          </P>

          <Section title="Who we are">
            <P>
              {SITE_NAME} is a family-owned farm based at {FARM_ADDRESS_LINE}.
              We sell Napier grass and plants, day-old chicks and birds, and
              small pets, with delivery across Tamil Nadu.
            </P>
            <P>
              Questions:{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-medium text-farm-green underline-offset-2 hover:text-farm-accent hover:underline"
              >
                {CONTACT_EMAIL}
              </a>{" "}
              or WhatsApp {WHATSAPP_DISPLAY}.
            </P>
          </Section>

          <Section title="Using our website">
            <P>You agree to:</P>
            <Ul>
              <Li>provide accurate phone, name, email, and delivery details;</Li>
              <Li>use the site only for lawful personal or farm-related purchases;</Li>
              <Li>
                not attempt to disrupt, scrape excessively, or misuse our
                systems, accounts, or payment flows.
              </Li>
            </Ul>
            <P>
              We may suspend or refuse service if we reasonably believe an
              account or order is fraudulent, abusive, or unsafe for animals.
            </P>
          </Section>

          <Section title="Accounts and login">
            <P>
              Sign-in may use phone OTP delivered via WhatsApp and, where
              configured, Facebook Login or similar providers. You are
              responsible for keeping access to your phone and linked accounts
              secure. Do not share one-time codes with anyone.
            </P>
          </Section>

          <Section title="Orders, pricing, and payment">
            <Ul>
              <Li>
                Product availability, prices, and units shown on the site may
                change; the price confirmed at checkout or on WhatsApp applies
                to that order.
              </Li>
              <Li>
                Online payments are processed by Razorpay. We do not store your
                card or UPI credentials.
              </Li>
              <Li>
                Orders may also be confirmed and fulfilled via WhatsApp after
                payment or enquiry.
              </Li>
              <Li>
                We may cancel or adjust an order if stock is unavailable, a
                payment fails, or delivery to your area is not possible. We
                will contact you and arrange a refund or alternative where
                appropriate.
              </Li>
            </Ul>
          </Section>

          <Section title="Delivery">
            <P>
              We deliver across Tamil Nadu where logistics allow. Delivery
              timing depends on product type (for example live chicks or
              plants), your district, and transport conditions. Exact
              schedules are confirmed after the order is accepted.
            </P>
            <P>
              Provide a reachable phone number and a clear delivery address.
              Delays or failed delivery caused by incorrect details are your
              responsibility.
            </P>
          </Section>

          <Section title="Live animals and plants">
            <P>
              Chicks, birds, and pets require suitable housing, feed, and care.
              Plants and fodder cuttings need appropriate planting and
              watering. We provide care guidance where available; you are
              responsible for husbandry after delivery. We may refuse a sale
              if we believe the buyer cannot care for the animal or stock.
            </P>
          </Section>

          <Section title="Refunds and cancellations">
            <P>
              Because many products are perishable or live, refunds and
              replacements are handled case by case. Contact us promptly with
              your order details if there is a problem on arrival. Approved
              refunds for online payments are returned through the original
              payment method via Razorpay where applicable.
            </P>
          </Section>

          <Section title="Intellectual property">
            <P>
              Site content, branding, and product photography belong to{" "}
              {SITE_NAME} or our licensors. You may not copy or reuse them for
              commercial purposes without our written permission.
            </P>
          </Section>

          <Section title="Privacy and data deletion">
            <P>
              How we handle personal data is described in our{" "}
              <Link
                href="/privacy-policy"
                className="font-medium text-farm-green underline-offset-2 hover:text-farm-accent hover:underline"
              >
                Privacy Policy
              </Link>
              . To request deletion of your account data, follow the steps on
              our{" "}
              <Link
                href="/data-deletion"
                className="font-medium text-farm-green underline-offset-2 hover:text-farm-accent hover:underline"
              >
                Data Deletion
              </Link>{" "}
              page.
            </P>
          </Section>

          <Section title="Limitation of liability">
            <P>
              To the fullest extent permitted by Indian law, {SITE_NAME} is
              not liable for indirect or consequential losses arising from use
              of the site or from delays beyond our reasonable control
              (including transport strikes, weather, or disease outbreaks
              affecting livestock). Our liability for any order is limited to
              the amount you paid for that order.
            </P>
          </Section>

          <Section title="Changes">
            <P>
              We may update these Terms from time to time. The &ldquo;Last
              updated&rdquo; date will change when we do. Continued use of the
              site after changes means you accept the updated Terms.
            </P>
          </Section>

          <Section title="Governing law">
            <P>
              These Terms are governed by the laws of India. Courts in Karur,
              Tamil Nadu have jurisdiction, subject to mandatory consumer
              protections that apply to you.
            </P>
          </Section>

          <Section title="Contact">
            <P>
              {SITE_NAME}
              <br />
              {FARM_ADDRESS_LINE}
              <br />
              Email:{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-medium text-farm-green underline-offset-2 hover:text-farm-accent hover:underline"
              >
                {CONTACT_EMAIL}
              </a>
              <br />
              WhatsApp: {WHATSAPP_DISPLAY}
            </P>
          </Section>
        </div>
      </article>
    </>
  );
}
