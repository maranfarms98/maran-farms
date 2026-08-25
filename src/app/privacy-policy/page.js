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
  { name: "Privacy Policy", href: "/privacy-policy" },
];

const LAST_UPDATED = "25 August 2026";

export const metadata = pageMetadata({
  title: "Privacy Policy | Maran Farms",
  description:
    "How Maran Farms collects, uses, and protects your personal information when you browse, order, or contact us.",
  path: "/privacy-policy",
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

export default function PrivacyPolicyPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <article className="container-farm max-w-3xl pt-24 pb-24 md:pt-28 md:pb-20">
        <Breadcrumbs items={crumbs} />
        <p className="text-eyebrow mt-8 text-farm-sage">Legal</p>
        <h1 className="font-heading mt-2 text-[1.65rem] leading-tight text-farm-green-dark md:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-farm-sage">Last updated: {LAST_UPDATED}</p>

        <div className="mt-8">
          <P>
            {SITE_NAME} (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;)
            operates the website at{" "}
            <Link
              href="/"
              className="font-medium text-farm-green underline-offset-2 hover:text-farm-accent hover:underline"
            >
              maranfarms.in
            </Link>
            . This policy explains what personal information we collect, how we
            use it, and the choices you have.
          </P>

          <Section title="Who we are">
            <P>
              {SITE_NAME} is a family-owned farm based at {FARM_ADDRESS_LINE}.
              We sell Napier grass, day-old chicks, and small pets, with
              delivery across Tamil Nadu.
            </P>
            <P>
              For privacy-related questions, contact us at{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-medium text-farm-green underline-offset-2 hover:text-farm-accent hover:underline"
              >
                {CONTACT_EMAIL}
              </a>{" "}
              or WhatsApp {WHATSAPP_DISPLAY}.
            </P>
          </Section>

          <Section title="Information we collect">
            <P>Depending on how you use our site, we may collect:</P>
            <Ul>
              <Li>
                <strong className="font-semibold text-farm-green-dark">
                  Account details
                </strong>{" "}
                — phone number and name when you sign in with OTP sent on
                WhatsApp.
              </Li>
              <Li>
                <strong className="font-semibold text-farm-green-dark">
                  Contact details
                </strong>{" "}
                — email address and delivery address when you place an order.
              </Li>
              <Li>
                <strong className="font-semibold text-farm-green-dark">
                  Order information
                </strong>{" "}
                — products, quantities, order totals, and payment status.
              </Li>
              <Li>
                <strong className="font-semibold text-farm-green-dark">
                  Cart contents
                </strong>{" "}
                — items you add to your cart, stored in your browser until you
                checkout or clear it.
              </Li>
              <Li>
                <strong className="font-semibold text-farm-green-dark">
                  Newsletter email
                </strong>{" "}
                — if you subscribe to farm updates via our footer form.
              </Li>
              <Li>
                <strong className="font-semibold text-farm-green-dark">
                  Usage data
                </strong>{" "}
                — anonymised analytics such as pages visited and general
                device/browser information.
              </Li>
            </Ul>
            <P>
              We do not store your card, UPI, or bank details. Payments are
              processed by Razorpay on their secure checkout.
            </P>
          </Section>

          <Section title="How we use your information">
            <P>We use the information we collect to:</P>
            <Ul>
              <Li>create and manage your account;</Li>
              <Li>process orders, payments, and delivery;</Li>
              <Li>send order confirmations and updates by email;</Li>
              <Li>respond to WhatsApp and email enquiries;</Li>
              <Li>improve our website and understand how visitors use it;</Li>
              <Li>prevent fraud and keep our services secure.</Li>
            </Ul>
          </Section>

          <Section title="Cookies and local storage">
            <P>Our site uses:</P>
            <Ul>
              <Li>
                a session cookie to keep you signed in after OTP verification;
              </Li>
              <Li>
                browser local storage to remember your shopping cart between
                visits.
              </Li>
            </Ul>
            <P>
              You can clear cookies and local storage in your browser settings.
              Doing so will sign you out and empty your cart.
            </P>
          </Section>

          <Section title="Third-party services">
            <P>
              We use trusted providers to run our website and fulfil orders.
              They process data on our behalf and only as needed to provide
              their service:
            </P>
            <Ul>
              <Li>
                <strong className="font-semibold text-farm-green-dark">
                  Supabase
                </strong>{" "}
                — account profiles, orders, and authentication data.
              </Li>
              <Li>
                <strong className="font-semibold text-farm-green-dark">
                  Razorpay
                </strong>{" "}
                — payment processing.
              </Li>
              <Li>
                <strong className="font-semibold text-farm-green-dark">
                  Resend
                </strong>{" "}
                — transactional order emails.
              </Li>
              <Li>
                <strong className="font-semibold text-farm-green-dark">
                  Vercel
                </strong>{" "}
                — website hosting and anonymised analytics.
              </Li>
              <Li>
                <strong className="font-semibold text-farm-green-dark">
                  WhatsApp
                </strong>{" "}
                — login OTP delivery and when you contact us or place orders via
                WhatsApp. Meta&apos;s terms and privacy policy apply to that
                channel.
              </Li>
            </Ul>
          </Section>

          <Section title="Data retention">
            <P>
              We keep account and order records for as long as needed to fulfil
              orders, comply with applicable law, and resolve disputes. OTP
              codes are deleted after verification or expiry.
            </P>
          </Section>

          <Section title="Your rights">
            <P>You may ask us to:</P>
            <Ul>
              <Li>access the personal information we hold about you;</Li>
              <Li>correct inaccurate details;</Li>
              <Li>delete your account, subject to legal and order records we must retain.</Li>
            </Ul>
            <P>
              Email{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-medium text-farm-green underline-offset-2 hover:text-farm-accent hover:underline"
              >
                {CONTACT_EMAIL}
              </a>{" "}
              with your request. We will respond within a reasonable time.
            </P>
          </Section>

          <Section title="Children">
            <P>
              Our services are not directed at children under 18. We do not
              knowingly collect personal information from children.
            </P>
          </Section>

          <Section title="Changes to this policy">
            <P>
              We may update this policy from time to time. The &ldquo;Last
              updated&rdquo; date at the top will change when we do. Continued
              use of the site after changes means you accept the updated policy.
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
