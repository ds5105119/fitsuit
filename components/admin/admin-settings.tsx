"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export function AdminSettings() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [createMessage, setCreateMessage] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [admins, setAdmins] = useState<{ username: string; createdAt: string }[]>([]);
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState<string | null>(null);
  const [deletingUser, setDeletingUser] = useState<string | null>(null);

  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat("ko-KR", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    []
  );

  const loadAdmins = async () => {
    setListLoading(true);
    setListError(null);
    const res = await fetch("/api/admin/users", { cache: "no-store" });
    setListLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setListError(data?.error || "관리자 목록을 불러오지 못했습니다.");
      return;
    }
    const data = await res.json().catch(() => null);
    setAdmins(data?.users ?? []);
    setCurrentUsername(data?.currentUsername ?? null);
  };

  useEffect(() => {
    loadAdmins();
  }, []);

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
    await loadAdmins();
  };

  const createAdmin = async () => {
    setCreating(true);
    setCreateMessage(null);
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: newUsername, password: newPassword }),
    });
    setCreating(false);
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setCreateMessage(data?.error || "생성에 실패했습니다. 다시 시도해주세요.");
      return;
    }
    setCreateMessage("새 관리자 계정이 생성되었습니다.");
    setNewUsername("");
    setNewPassword("");
    await loadAdmins();
  };

  const deleteAdmin = async (targetUsername: string) => {
    if (deletingUser) return;
    const ok = window.confirm(`관리자 ${targetUsername} 계정을 삭제하시겠습니까?`);
    if (!ok) return;
    setDeletingUser(targetUsername);
    setListError(null);
    const res = await fetch("/api/admin/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: targetUsername }),
    });
    setDeletingUser(null);
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setListError(data?.error || "삭제에 실패했습니다.");
      return;
    }
    await loadAdmins();
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  };

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6">
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

      <div className="mt-8 border-t border-neutral-200 pt-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">New Admin</p>
            <h2 className="text-xl font-bold text-neutral-900">신규 관리자 생성</h2>
            <p className="text-sm text-neutral-500">새 관리자 계정을 추가할 수 있습니다.</p>
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <input
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder="새 관리자 아이디"
            className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-neutral-900 outline-none ring-neutral-300 focus:border-neutral-400 focus:ring-2"
          />
          <input
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="새 관리자 비밀번호"
            type="password"
            className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-neutral-900 outline-none ring-neutral-300 focus:border-neutral-400 focus:ring-2"
          />
        </div>
        <div className="mt-3 flex items-center gap-3">
          <button
            onClick={createAdmin}
            disabled={creating || !newUsername || !newPassword}
            className="rounded-full bg-neutral-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {creating ? "생성 중..." : "관리자 생성"}
          </button>
          {createMessage && <span className="text-sm text-neutral-700">{createMessage}</span>}
        </div>
      </div>

      <div className="mt-8 border-t border-neutral-200 pt-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">Admin List</p>
            <h2 className="text-xl font-bold text-neutral-900">관리자 목록</h2>
            <p className="text-sm text-neutral-500">현재 등록된 관리자 계정을 확인하고 삭제할 수 있습니다.</p>
          </div>
          <button
            onClick={loadAdmins}
            className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-800 hover:bg-neutral-100"
          >
            새로고침
          </button>
        </div>

        {listError && <p className="mt-3 text-sm text-red-600">{listError}</p>}

        <div className="mt-4 overflow-hidden rounded-xl border border-neutral-200 bg-white">
          <div className="grid grid-cols-[1.2fr_1fr_auto] gap-4 border-b border-neutral-200 px-4 py-3 text-xs font-semibold text-neutral-500">
            <span>아이디</span>
            <span>생성일</span>
            <span className="text-right">관리</span>
          </div>
          {listLoading ? (
            <div className="px-4 py-4 text-sm text-neutral-500">목록 불러오는 중...</div>
          ) : admins.length === 0 ? (
            <div className="px-4 py-4 text-sm text-neutral-500">등록된 관리자가 없습니다.</div>
          ) : (
            admins.map((admin) => (
              <div key={admin.username} className="grid grid-cols-[1.2fr_1fr_auto] gap-4 border-b border-neutral-100 px-4 py-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-neutral-900">{admin.username}</span>
                  {admin.username === currentUsername && (
                    <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-semibold text-sky-700">
                      현재 로그인
                    </span>
                  )}
                </div>
                <span className="text-neutral-600">{formatter.format(new Date(admin.createdAt))}</span>
                <div className="flex justify-end">
                  <button
                    onClick={() => deleteAdmin(admin.username)}
                    disabled={admin.username === currentUsername || deletingUser === admin.username}
                    className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {deletingUser === admin.username ? "삭제 중..." : "삭제"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
