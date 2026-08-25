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
import { getGenericInquiryUrl } from "@/lib/whatsapp";

const crumbs = [
  { name: "Home", href: "/" },
  { name: "Data Deletion", href: "/data-deletion" },
];

const LAST_UPDATED = "25 August 2026";

export const metadata = pageMetadata({
  title: "Data Deletion Instructions | Maran Farms",
  description:
    "How to request deletion of your Maran Farms account and personal data, including data linked through Facebook Login.",
  path: "/data-deletion",
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

function Ol({ children }) {
  return (
    <ol className="mt-4 list-decimal space-y-2 pl-5 text-farm-sage">
      {children}
    </ol>
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

export default function DataDeletionPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <article className="container-farm max-w-3xl pt-24 pb-24 md:pt-28 md:pb-20">
        <Breadcrumbs items={crumbs} />
        <p className="text-eyebrow mt-8 text-farm-sage">Legal</p>
        <h1 className="font-heading mt-2 text-[1.65rem] leading-tight text-farm-green-dark md:text-4xl">
          User data deletion
        </h1>
        <p className="mt-3 text-sm text-farm-sage">Last updated: {LAST_UPDATED}</p>

        <div className="mt-8">
          <P>
            If you used {SITE_NAME} (including Facebook Login or related Meta
            products connected to our app), you can request that we delete the
            personal data we hold about you. This page explains how.
          </P>

          <Section title="How to request deletion">
            <Ol>
              <Li>
                Email{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Data deletion request")}`}
                  className="font-medium text-farm-green underline-offset-2 hover:text-farm-accent hover:underline"
                >
                  {CONTACT_EMAIL}
                </a>{" "}
                with the subject line{" "}
                <strong className="font-semibold text-farm-green-dark">
                  Data deletion request
                </strong>
                , or message us on{" "}
                <a
                  href={getGenericInquiryUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-farm-green underline-offset-2 hover:text-farm-accent hover:underline"
                >
                  WhatsApp ({WHATSAPP_DISPLAY})
                </a>
                .
              </Li>
              <Li>
                Include the phone number and/or email you used on{" "}
                {SITE_NAME}, and (if applicable) the Facebook or Instagram
                account name you used to log in.
              </Li>
              <Li>
                We will verify the request belongs to you, then delete or
                anonymise your account data as described below.
              </Li>
            </Ol>
          </Section>

          <Section title="What we delete">
            <P>On a verified request we will remove or anonymise:</P>
            <Ul>
              <Li>your profile (name, phone, email);</Li>
              <Li>login/session records and OTP history linked to you;</Li>
              <Li>
                Facebook Login identifiers associated with your {SITE_NAME}{" "}
                account, where we stored them.
              </Li>
            </Ul>
            <P>
              Cart data stored only in your browser can be cleared by you in
              browser settings (local storage).
            </P>
          </Section>

          <Section title="What we may retain">
            <P>
              We may keep limited order and payment records where Indian law,
              tax, accounting, or dispute resolution requires it. Those records
              are not used for marketing and are kept only as long as required.
            </P>
          </Section>

          <Section title="Timing">
            <P>
              We aim to complete deletion within 30 days of verifying your
              request. We will confirm by email or WhatsApp when it is done.
            </P>
          </Section>

          <Section title="Related policies">
            <P>
              See also our{" "}
              <Link
                href="/privacy-policy"
                className="font-medium text-farm-green underline-offset-2 hover:text-farm-accent hover:underline"
              >
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link
                href="/terms-of-service"
                className="font-medium text-farm-green underline-offset-2 hover:text-farm-accent hover:underline"
              >
                Terms of Service
              </Link>
              .
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
