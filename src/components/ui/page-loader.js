import { Spinner } from "@/components/ui/spinner";

/** Full-main loading surface — tall enough that the footer stays off-screen. */
export function PageLoader({ label = "Loading…" } = {}) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      className="flex min-h-[calc(100svh-5.5rem)] w-full flex-1 flex-col items-center justify-center gap-3 py-24"
    >
      <Spinner className="size-8 text-farm-green" />
      <span className="text-sm font-medium text-farm-sage">{label}</span>
    </div>
  );
}
