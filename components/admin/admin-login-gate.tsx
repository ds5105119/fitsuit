"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/admin-login-form";

export function AdminLoginGate() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const check = async () => {
      const res = await fetch("/api/admin/me", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json().catch(() => null);
        if (data?.authenticated) {
          router.replace("/admin");
          return;
        }
      }
      setChecking(false);
    };
    check();
  }, [router]);

  if (checking) {
    return <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">확인 중...</div>;
  }

  return <AdminLoginForm />;
}
