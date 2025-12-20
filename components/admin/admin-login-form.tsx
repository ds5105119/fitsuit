"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminLoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = String(formData.get("username") || "");
    const password = String(formData.get("password") || "");

    setLoading(true);
    setError(null);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error || "로그인 실패");
      return;
    }

    router.replace("/admin");
    router.refresh();
  };

  return (
    <form className="space-y-4" onSubmit={submit}>
      <div className="space-y-2">
        <label className="text-sm text-black/80" htmlFor="username">
          아이디
        </label>
        <input id="username" name="username" required className="w-full rounded-xl border border-black/15 bg-neutral-100 px-3 py-2 outline-none" />
      </div>
      <div className="space-y-2">
        <label className="text-sm text-black/80" htmlFor="password">
          비밀번호
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full rounded-xl border border-black/15 bg-neutral-100 px-3 py-2 outline-none"
        />
      </div>
      {error && <p className="text-sm text-red-200">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-amber-400 px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-black transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "로그인 중..." : "로그인"}
      </button>
    </form>
  );
}
