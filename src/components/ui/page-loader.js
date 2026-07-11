import { Spinner } from "@/components/ui/spinner";

export function PageLoader() {
  return (
    <div className="flex min-h-[60vh] w-full flex-1 items-center justify-center py-24">
      <Spinner className="size-8 text-farm-green" />
    </div>
  );
}
