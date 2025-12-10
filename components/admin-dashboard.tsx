"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Inquiry = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  attachmentUrl: string | null;
};

type State =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; inquiries: Inquiry[] };

export function AdminDashboard() {
  const router = useRouter();
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/admin/inquiries", { cache: "no-store" });
      if (res.status === 401) {
        router.replace("/admin/login");
        return;
      }
      if (!res.ok) {
        setState({ status: "error", message: "불러오기에 실패했습니다." });
        return;
      }
      const data = await res.json();
      setState({ status: "ready", inquiries: data.inquiries ?? [] });
    };
    load();
  }, [router]);

  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat("ko-KR", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    []
  );

  if (state.status === "loading") {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
        로딩 중...
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="rounded-2xl border border-red-400/40 bg-red-900/30 p-6 text-sm text-red-100">
        {state.message}
      </div>
    );
  }

  const { inquiries } = state;

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      <table className="min-w-full divide-y divide-white/10 text-sm">
        <thead className="bg-white/5 text-left uppercase tracking-[0.14em] text-white/70">
          <tr>
            <th className="px-4 py-3">날짜</th>
            <th className="px-4 py-3">이름</th>
            <th className="px-4 py-3">연락처</th>
            <th className="px-4 py-3">메시지</th>
            <th className="px-4 py-3">첨부</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {inquiries.map((inq) => (
            <tr key={inq.id} className="hover:bg-white/5">
              <td className="px-4 py-3 text-white/70">
                {formatter.format(new Date(inq.createdAt))}
              </td>
              <td className="px-4 py-3">
                <div className="font-semibold text-white">{inq.name}</div>
                <div className="text-xs text-white/60">{inq.email}</div>
              </td>
              <td className="px-4 py-3 text-white/80">{inq.phone || "-"}</td>
              <td className="px-4 py-3">
                <div className="line-clamp-3 text-white/80">{inq.message}</div>
              </td>
              <td className="px-4 py-3">
                {inq.attachmentUrl ? (
                  <a
                    href={inq.attachmentUrl}
                    className="text-amber-200 underline underline-offset-4"
                    target="_blank"
                    rel="noreferrer"
                  >
                    보기
                  </a>
                ) : (
                  <span className="text-white/50">없음</span>
                )}
              </td>
            </tr>
          ))}
          {inquiries.length === 0 && (
            <tr>
              <td
                className="px-4 py-6 text-center text-white/60"
                colSpan={5}
              >
                아직 접수된 문의가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
