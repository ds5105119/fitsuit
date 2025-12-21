"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Inquiry = {
  id: string;
  createdAt: string;
  orderId: string | null;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  attachmentUrl: string | null;
  replyMessage: string | null;
  replyUpdatedAt: string | null;
};

type State =
  | { status: "loading" }
  | { status: "error"; message: string }
  | {
      status: "ready";
      inquiries: Inquiry[];
      total: number;
      filteredTotal: number;
      pendingCount: number;
      page: number;
      pageSize: number;
    };

const PAGE_SIZE = 20;

export function AdminDashboard({
  initialFilters,
}: {
  initialFilters?: {
    q?: string;
    start?: string;
    end?: string;
    reply?: "all" | "pending" | "answered";
    orderId?: string;
    page?: number;
  };
}) {
  const router = useRouter();
  const [state, setState] = useState<State>({ status: "loading" });
  const [query, setQuery] = useState(initialFilters?.orderId ?? initialFilters?.q ?? "");
  const [startDate, setStartDate] = useState(initialFilters?.start ?? "");
  const [endDate, setEndDate] = useState(initialFilters?.end ?? "");
  const [replyFilter, setReplyFilter] = useState<"all" | "pending" | "answered">(initialFilters?.reply ?? "all");
  const [orderIdFilter, setOrderIdFilter] = useState(initialFilters?.orderId ?? "");
  const [page, setPage] = useState(initialFilters?.page ?? 1);

  useEffect(() => {
    const load = async () => {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("pageSize", String(PAGE_SIZE));
      const trimmed = query.trim();
      if (trimmed) params.set("q", trimmed);
      if (startDate) params.set("start", startDate);
      if (endDate) params.set("end", endDate);
      if (replyFilter !== "all") params.set("reply", replyFilter);
      if (orderIdFilter) params.set("orderId", orderIdFilter);

      const res = await fetch(`/api/admin/inquiries?${params.toString()}`, { cache: "no-store" });
      if (res.status === 401) {
        router.replace("/admin/login");
        return;
      }
      if (!res.ok) {
        setState({ status: "error", message: "불러오기에 실패했습니다." });
        return;
      }
      const data = await res.json().catch(() => null);
      const nextPage = Number(data?.page ?? page);
      if (Number.isFinite(nextPage) && nextPage !== page) {
        setPage(nextPage);
      }
      setState({
        status: "ready",
        inquiries: data?.inquiries ?? [],
        total: Number(data?.total ?? 0),
        filteredTotal: Number(data?.filteredTotal ?? 0),
        pendingCount: Number(data?.pendingCount ?? 0),
        page: Number.isFinite(nextPage) ? nextPage : page,
        pageSize: Number(data?.pageSize ?? PAGE_SIZE),
      });
    };
    load();
  }, [router, endDate, orderIdFilter, page, query, replyFilter, startDate]);

  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat("ko-KR", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    []
  );

  const inquiries = state.status === "ready" ? state.inquiries : [];
  const total = state.status === "ready" ? state.total : 0;
  const filteredTotal = state.status === "ready" ? state.filteredTotal : 0;
  const pendingCount = state.status === "ready" ? state.pendingCount : 0;
  const pageSize = state.status === "ready" ? state.pageSize : PAGE_SIZE;
  const currentPage = state.status === "ready" ? state.page : page;
  const totalPages = Math.max(1, Math.ceil(filteredTotal / pageSize));

  const highlightCutoff = Date.now() - 24 * 60 * 60 * 1000;

  if (state.status === "loading") {
    return <div className="rounded-2xl border border-neutral-200 bg-white p-4 text-sm text-neutral-500">문의 로딩 중...</div>;
  }

  if (state.status === "error") {
    return <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{state.message}</div>;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 px-4 py-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-neutral-500">INQUIRIES</p>
          <p className="text-sm text-neutral-500">
            전체 {total} · 답변 대기 {pendingCount} · 필터 {filteredTotal}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <input
            type="date"
            value={startDate}
            onChange={(event) => {
              setStartDate(event.target.value);
              setPage(1);
            }}
            className="h-9 rounded-md border border-neutral-300 bg-white px-2 text-xs text-neutral-700"
          />
          <span className="text-xs text-neutral-400">~</span>
          <input
            type="date"
            value={endDate}
            onChange={(event) => {
              setEndDate(event.target.value);
              setPage(1);
            }}
            className="h-9 rounded-md border border-neutral-300 bg-white px-2 text-xs text-neutral-700"
          />
          <select
            value={replyFilter}
            onChange={(event) => {
              setReplyFilter(event.target.value as typeof replyFilter);
              setPage(1);
            }}
            className="h-9 rounded-md border border-neutral-300 bg-white px-2 text-xs text-neutral-700"
          >
            <option value="all">전체</option>
            <option value="pending">답변 대기</option>
            <option value="answered">답변 완료</option>
          </select>
          {orderIdFilter && (
            <div className="flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-3 py-1 text-xs text-neutral-600">
              <span className="font-mono text-[11px]">{orderIdFilter.slice(0, 8).toUpperCase()}</span>
              <button
                type="button"
                onClick={() => {
                  setOrderIdFilter("");
                  setPage(1);
                }}
                className="text-[11px] text-neutral-500 hover:text-neutral-700"
              >
                해제
              </button>
            </div>
          )}
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="이름/이메일/내용 검색"
            className="h-9 w-56 rounded-md border border-neutral-300 bg-white px-3 text-xs text-neutral-700"
          />
          {(query || startDate || endDate || replyFilter !== "all" || orderIdFilter) && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setStartDate("");
                setEndDate("");
                setReplyFilter("all");
                setOrderIdFilter("");
                setPage(1);
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
            <th className="px-4 py-3">이름</th>
            <th className="px-4 py-3">주문</th>
            <th className="px-4 py-3">메시지</th>
            <th className="px-4 py-3">답변</th>
            <th className="px-4 py-3">관리</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {inquiries.map((inq) => {
            const isNew = !inq.replyMessage && new Date(inq.createdAt).getTime() > highlightCutoff;
            return (
            <tr key={inq.id} className={isNew ? "bg-amber-50/40 hover:bg-amber-50/70" : "hover:bg-neutral-50"}>
              <td className="px-4 py-3 text-neutral-600">{formatter.format(new Date(inq.createdAt))}</td>
              <td className="px-4 py-3">
                <div className="font-semibold text-neutral-900">{inq.name}</div>
                <div className="text-xs text-neutral-500">{inq.email}</div>
                <div className="text-xs text-neutral-500">{inq.phone || "-"}</div>
              </td>
              <td className="px-4 py-3 text-neutral-700">
                {inq.orderId ? (
                  <a href={`/admin/orders/${inq.orderId}`} className="font-mono text-xs text-sky-700 underline underline-offset-4">
                    {inq.orderId.slice(0, 8).toUpperCase()}
                  </a>
                ) : (
                  "-"
                )}
              </td>
              <td className="px-4 py-3">
                <div className="line-clamp-3 text-neutral-700">{inq.message}</div>
              </td>
              <td className="px-4 py-3">
                <span
                  className={
                    inq.replyMessage
                      ? "rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-600"
                      : "rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-600"
                  }
                >
                  {inq.replyMessage ? "답변 완료" : "대기"}
                </span>
              </td>
              <td className="px-4 py-3">
                <a href={`/admin/inquiries/${inq.id}`} className="text-neutral-900 underline underline-offset-4">
                  상세
                </a>
              </td>
            </tr>
          )})}
          {inquiries.length === 0 && (
            <tr>
              <td className="px-4 py-6 text-center text-neutral-500" colSpan={6}>
                조건에 맞는 문의가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200 px-4 py-3 text-xs text-neutral-500">
        <span>
          총 {filteredTotal}건 · 페이지 {currentPage} / {totalPages}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage <= 1}
            className="rounded-md border border-neutral-300 px-3 py-1 text-xs text-neutral-700 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            이전
          </button>
          <button
            type="button"
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage >= totalPages}
            className="rounded-md border border-neutral-300 px-3 py-1 text-xs text-neutral-700 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
}
