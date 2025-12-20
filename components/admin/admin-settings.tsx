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
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">Admin Settings</p>
          <h2 className="text-xl font-bold text-neutral-900">계정 정보 변경 / 로그아웃</h2>
          <p className="text-sm text-neutral-500">기본 계정: admin / admin. 비밀번호를 꼭 변경하세요.</p>
        </div>
        <button
          onClick={logout}
          className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-100"
        >
          로그아웃
        </button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="새 아이디"
          className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-neutral-900 outline-none ring-neutral-300 focus:border-neutral-400 focus:ring-2"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="새 비밀번호"
          type="password"
          className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-neutral-900 outline-none ring-neutral-300 focus:border-neutral-400 focus:ring-2"
        />
      </div>
      <div className="mt-3 flex items-center gap-3">
        <button
          onClick={submit}
          disabled={loading || !username || !password}
          className="rounded-full bg-neutral-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "저장 중..." : "아이디/비밀번호 변경"}
        </button>
        {message && <span className="text-sm text-neutral-700">{message}</span>}
      </div>
    </div>
  );
}
