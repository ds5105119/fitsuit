"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminSettings() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    setMessage(null);
    const res = await fetch("/api/admin/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setMessage(data?.error || "실패했습니다. 다시 시도해주세요.");
      return;
    }
    setMessage("변경되었습니다.");
    setUsername("");
    setPassword("");
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-amber-200">
            Admin Settings
          </p>
          <h2 className="text-xl font-semibold text-white">
            계정 정보 변경 / 로그아웃
          </h2>
          <p className="text-sm text-white/60">
            기본 계정: admin / admin. 비밀번호를 꼭 변경하세요.
          </p>
        </div>
        <button
          onClick={logout}
          className="rounded-full border border-white/30 px-4 py-2 text-sm text-white transition hover:border-amber-200"
        >
          로그아웃
        </button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="새 아이디"
          className="rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-white outline-none ring-amber-300/40 focus:border-amber-200 focus:ring-2"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="새 비밀번호"
          type="password"
          className="rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-white outline-none ring-amber-300/40 focus:border-amber-200 focus:ring-2"
        />
      </div>
      <div className="mt-3 flex items-center gap-3">
        <button
          onClick={submit}
          disabled={loading || !username || !password}
          className="rounded-full bg-amber-400 px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-black shadow-[0_12px_35px_rgba(255,193,7,0.3)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_45px_rgba(255,193,7,0.4)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "저장 중..." : "아이디/비밀번호 변경"}
        </button>
        {message && <span className="text-sm text-white/80">{message}</span>}
      </div>
    </div>
  );
}
