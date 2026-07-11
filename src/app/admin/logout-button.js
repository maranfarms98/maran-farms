"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

export function AdminLogoutButton({ className }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className={
        className ||
        "focus-ring flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-farm-accent hover:bg-farm-accent-light disabled:opacity-60"
      }
    >
      {loading ? <Spinner className="size-4" /> : <LogOut className="size-4" />}
      Logout
    </button>
  );
}
