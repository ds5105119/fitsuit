"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type ConciergeOrder = {
  id: string;
  createdAt: string;
  userEmail: string;
  userName: string | null;
  status: string;
  selections: unknown;
  measurements: unknown;
};

type State =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; orders: ConciergeOrder[] };

export function AdminOrdersDashboard() {
  const router = useRouter();
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/admin/orders", { cache: "no-store" });
      if (res.status === 401) {
        router.replace("/admin/login");
        return;
      }
      if (!res.ok) {
        setState({ status: "error", message: "불러오기에 실패했습니다." });
        return;
      }
      const data = await res.json().catch(() => null);
      setState({ status: "ready", orders: data?.orders ?? [] });
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
        주문 로딩 중...
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

  const { orders } = state;

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-amber-200">
            Orders
          </p>
          <p className="text-sm text-white/70">
            컨시어지 주문 내역 ({orders.length})
          </p>
        </div>
      </div>

      <table className="min-w-full divide-y divide-white/10 text-sm">
        <thead className="bg-white/5 text-left uppercase tracking-[0.14em] text-white/70">
          <tr>
            <th className="px-4 py-3">날짜</th>
            <th className="px-4 py-3">고객</th>
            <th className="px-4 py-3">주문번호</th>
            <th className="px-4 py-3">상태</th>
            <th className="px-4 py-3">사이즈</th>
            <th className="px-4 py-3">보기</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {orders.map((o) => {
            const hasMeasurements =
              o.measurements && typeof o.measurements === "object"
                ? Object.values(o.measurements as any).some(Boolean)
                : false;

            return (
              <tr key={o.id} className="hover:bg-white/5">
                <td className="px-4 py-3 text-white/70">
                  {formatter.format(new Date(o.createdAt))}
                </td>
                <td className="px-4 py-3">
                  <div className="font-semibold text-white">
                    {o.userName || "-"}
                  </div>
                  <div className="text-xs text-white/60">{o.userEmail}</div>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-white/80">
                  {o.id.slice(0, 8).toUpperCase()}
                </td>
                <td className="px-4 py-3 text-white/80">{o.status}</td>
                <td className="px-4 py-3 text-white/80">
                  {hasMeasurements ? "입력" : "-"}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/orders/${o.id}`}
                    className="text-amber-200 underline underline-offset-4"
                  >
                    상세
                  </Link>
                </td>
              </tr>
            );
          })}

          {orders.length === 0 && (
            <tr>
              <td className="px-4 py-6 text-center text-white/60" colSpan={6}>
                아직 접수된 주문이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

