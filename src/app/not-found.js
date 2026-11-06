import Link from "next/link";

export const metadata = {
  title: { absolute: "Page not found | Maran Farms" },
  description: "This page is not available on the Maran Farms website.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="container-farm flex flex-1 flex-col items-center justify-center px-4 py-28 text-center">
      <p className="text-eyebrow text-farm-green">404</p>
      <h1 className="font-heading mt-2 text-[1.65rem] leading-tight text-farm-green-dark md:text-4xl">
        This page is not on the farm
      </h1>
      <p className="mt-4 max-w-md text-farm-sage">
        The link may be out of date. Head back to Maran Farms or browse what we
        grow in Karur.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="focus-ring inline-flex h-12 items-center rounded-full bg-farm-green px-7 text-button font-semibold text-farm-green-light"
        >
          Home
        </Link>
        <Link
          href="/#harvest-paths"
          className="focus-ring inline-flex h-12 items-center rounded-full border border-farm-green-dark/15 bg-farm-warm px-7 text-button font-semibold text-farm-green"
        >
          View products
        </Link>
      </div>
    </div>
  );
}
