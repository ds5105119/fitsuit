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

type State = { status: "loading" } | { status: "error"; message: string } | { status: "ready"; orders: ConciergeOrder[] };

export function AdminOrdersDashboard({
  initialFilters,
}: {
  initialFilters?: {
    status?: string;
    q?: string;
    start?: string;
    end?: string;
  };
}) {
  const router = useRouter();
  const [state, setState] = useState<State>({ status: "loading" });
  const [query, setQuery] = useState(initialFilters?.q ?? "");
  const [startDate, setStartDate] = useState(initialFilters?.start ?? "");
  const [endDate, setEndDate] = useState(initialFilters?.end ?? "");
  const [statusFilter, setStatusFilter] = useState(initialFilters?.status ?? "all");

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

  const orders = state.status === "ready" ? state.orders : [];
  const inProgressCount = orders.filter((order) => !["완료", "취소"].includes(order.status)).length;

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const start = startDate ? new Date(`${startDate}T00:00:00`) : null;
    const end = endDate ? new Date(`${endDate}T23:59:59.999`) : null;
    return orders.filter((order) => {
      const created = new Date(order.createdAt);
      if (start && created < start) return false;
      if (end && created > end) return false;
      if (statusFilter !== "all" && order.status !== statusFilter) return false;
      if (!normalizedQuery) return true;
      const haystack = [order.id, order.userName ?? "", order.userEmail, order.status].join(" ").toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [endDate, orders, query, startDate, statusFilter]);

  const highlightCutoff = Date.now() - 24 * 60 * 60 * 1000;

  if (state.status === "loading") {
    return <div className="rounded-2xl border border-neutral-200 bg-white p-4 text-sm text-neutral-500">주문 로딩 중...</div>;
  }

  if (state.status === "error") {
    return <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{state.message}</div>;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 px-4 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">Orders</p>
          <p className="text-sm text-neutral-500">
            전체 {orders.length} · 진행중 {inProgressCount} · 필터 {filtered.length}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <input
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
            className="h-9 rounded-md border border-neutral-300 bg-white px-2 text-xs text-neutral-700"
          />
          <span className="text-xs text-neutral-400">~</span>
          <input
            type="date"
            value={endDate}
            onChange={(event) => setEndDate(event.target.value)}
            className="h-9 rounded-md border border-neutral-300 bg-white px-2 text-xs text-neutral-700"
          />
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="h-9 rounded-md border border-neutral-300 bg-white px-2 text-xs text-neutral-700"
          >
            <option value="all">전체</option>
            <option value="접수">접수</option>
            <option value="제작중">제작중</option>
            <option value="견적 완료">견적 완료</option>
            <option value="완료">완료</option>
            <option value="취소">취소</option>
          </select>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="주문번호/고객/이메일 검색"
            className="h-9 w-56 rounded-md border border-neutral-300 bg-white px-3 text-xs text-neutral-700"
          />
          {(query || startDate || endDate || statusFilter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setStartDate("");
                setEndDate("");
                setStatusFilter("all");
              }}
              className="h-9 rounded-md border border-neutral-300 px-3 text-xs text-neutral-700 hover:bg-neutral-50"
            >
              초기화
            </button>
          )}
        </div>
      </div>

      <table className="min-w-full divide-y divide-neutral-200 text-sm">
        <thead className="bg-neutral-50 text-left uppercase tracking-[0.12em] text-neutral-500">
          <tr>
            <th className="px-4 py-3">날짜</th>
            <th className="px-4 py-3">고객</th>
            <th className="px-4 py-3">주문번호</th>
            <th className="px-4 py-3">상태</th>
            <th className="px-4 py-3">사이즈</th>
            <th className="px-4 py-3">보기</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {filtered.map((o) => {
            const hasMeasurements = o.measurements && typeof o.measurements === "object" ? Object.values(o.measurements as any).some(Boolean) : false;
            const isNew = new Date(o.createdAt).getTime() > highlightCutoff;

            return (
              <tr key={o.id} className={isNew ? "bg-neutral-50 hover:bg-neutral-100" : "hover:bg-neutral-100"}>
                <td className="px-4 py-3 text-neutral-600">{formatter.format(new Date(o.createdAt))}</td>
                <td className="px-4 py-3">
                  <div className="font-semibold text-neutral-900">{o.userName || "-"}</div>
                  <div className="text-xs text-neutral-500">{o.userEmail}</div>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-neutral-700">{o.id.slice(0, 8).toUpperCase()}</td>
                <td className="px-4 py-3 text-neutral-700">{o.status}</td>
                <td className="px-4 py-3 text-neutral-700">{hasMeasurements ? "입력" : "-"}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1 text-xs">
                    <Link href={`/admin/orders/${o.id}`} className="text-neutral-900 underline underline-offset-4">
                      상세
                    </Link>
                    <Link href={`/admin/inquiries?orderId=${o.id}`} className="text-sky-700 underline underline-offset-4">
                      문의 보기
                    </Link>
                  </div>
                </td>
              </tr>
            );
          })}

          {filtered.length === 0 && (
            <tr>
              <td className="px-4 py-6 text-center text-neutral-500" colSpan={6}>
                조건에 맞는 주문이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
