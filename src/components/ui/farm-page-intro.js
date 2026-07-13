import { TamilCaption } from "@/components/ui/tamil-caption";

/** Shared bilingual intro for quiet pages (login, checkout, orders). */
export function FarmPageIntro({
  eyebrow,
  title,
  tamil,
  children,
  className = "",
}) {
  return (
    <div className={className}>
      {eyebrow && <p className="text-eyebrow text-farm-accent">{eyebrow}</p>}
      <h1 className="font-heading mt-2 text-3xl text-farm-green-dark md:text-4xl">
        {title}
      </h1>
      {tamil && <TamilCaption className="mt-2">{tamil}</TamilCaption>}
      <div className="mt-4 h-0.5 w-14 bg-[#b88e52]" aria-hidden />
      {children}
    </div>
  );
}
