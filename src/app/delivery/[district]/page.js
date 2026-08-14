import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllDistricts, getDistrictBySlug } from "@/data/districts";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { TamilCaption } from "@/components/ui/tamil-caption";
import { SITE_NAME, TELEPHONE_E164 } from "@/lib/site";

const CATEGORY_LINKS = [
  { href: "/category/napier-plants", label: "Napier & Plants" },
  { href: "/category/chicks-birds", label: "Chicks & Birds" },
  { href: "/category/small-pets", label: "Small Pets" },
];

export function generateStaticParams() {
  return getAllDistricts().map((d) => ({ district: d.slug }));
}

export async function generateMetadata({ params }) {
  const { district } = await params;
  const place = getDistrictBySlug(district);
  if (!place) return { title: "Delivery" };
  return pageMetadata({
    title: place.title,
    description: place.description,
    path: `/delivery/${place.slug}`,
  });
}

export default async function DistrictPage({ params }) {
  const { district } = await params;
  const place = getDistrictBySlug(district);
  if (!place) notFound();

  const crumbs = [
    { name: "Home", href: "/" },
    { name: `Delivery in ${place.name}`, href: `/delivery/${place.slug}` },
  ];

  const areaSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: place.title,
    description: place.description,
    about: {
      "@type": "AdministrativeArea",
      name: `${place.name}, Tamil Nadu`,
    },
    provider: {
      "@type": "LocalBusiness",
      name: SITE_NAME,
      telephone: TELEPHONE_E164,
      areaServed: `${place.name}, Tamil Nadu`,
    },
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={areaSchema} />
      <div className="container-farm max-w-3xl pt-28 pb-20">
        <Breadcrumbs items={crumbs} />
        <p className="text-eyebrow mt-8 text-farm-green">Delivery · Tamil Nadu</p>
        <h1 className="font-heading mt-2 text-3xl text-farm-green-dark md:text-4xl">
          Farm delivery in {place.name}
        </h1>
        <TamilCaption className="mt-2">{place.tamilName}</TamilCaption>
        <p className="mt-3 text-sm font-medium text-farm-accent">
          {place.focus}
        </p>

        <div className="mt-8 space-y-4">
          {place.body.map((para) => (
            <p key={para.slice(0, 40)} className="leading-relaxed text-farm-sage">
              {para}
            </p>
          ))}
        </div>

        <section className="mt-12">
          <h2 className="font-heading text-2xl text-farm-green-dark">
            Order for {place.name}
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            {CATEGORY_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="focus-ring flex h-full items-center justify-center rounded-2xl border border-farm-green-dark/10 bg-farm-warm px-4 py-5 text-center font-semibold text-farm-green-dark hover:border-farm-accent"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="font-heading text-2xl text-farm-green-dark">
            Other districts
          </h2>
          <ul className="mt-4 flex flex-wrap gap-3">
            {getAllDistricts()
              .filter((d) => d.slug !== place.slug)
              .map((d) => (
                <li key={d.slug}>
                  <Link
                    href={`/delivery/${d.slug}`}
                    className="focus-ring inline-flex rounded-full border border-farm-green-dark/10 bg-farm-cream px-4 py-2 text-sm font-medium text-farm-green hover:border-farm-accent"
                  >
                    {d.name}
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      </div>
    </>
  );
}
