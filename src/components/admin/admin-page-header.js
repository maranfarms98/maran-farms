export function AdminPageHeader({ title, subtitle, action, align = "end", className = "" }) {
  return (
    <div
      className={`flex flex-wrap justify-between gap-4 ${
        align === "center" ? "items-center" : "items-end"
      } ${className}`}
    >
      <div>
        <h1 className="font-heading text-3xl text-farm-green-dark">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-farm-sage">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function SupabaseNotConfigured({ title }) {
  return (
    <div>
      <h1 className="font-heading text-3xl text-farm-green-dark">{title}</h1>
      <p className="mt-4 text-sm text-farm-sage">
        Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and
        SUPABASE_SERVICE_ROLE_KEY in the deployment environment.
      </p>
    </div>
  );
}

export const adminInput =
  "h-11 w-full min-w-0 rounded-xl border border-farm-green-dark/15 bg-white px-3 text-sm";

export const adminPrimaryButton =
  "focus-ring inline-flex h-11 items-center gap-2 rounded-full bg-farm-green px-5 text-sm font-semibold text-farm-green-light";
