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

type State = { status: "loading" } | { status: "error"; message: string } | { status: "ready"; inquiries: Inquiry[] };

export function AdminDashboard({
  initialFilters,
}: {
  initialFilters?: {
    q?: string;
    start?: string;
    end?: string;
    reply?: "all" | "pending" | "answered";
    orderId?: string;
  };
}) {
  const router = useRouter();
  const [state, setState] = useState<State>({ status: "loading" });
  const [query, setQuery] = useState(initialFilters?.orderId ?? initialFilters?.q ?? "");
  const [startDate, setStartDate] = useState(initialFilters?.start ?? "");
  const [endDate, setEndDate] = useState(initialFilters?.end ?? "");
  const [replyFilter, setReplyFilter] = useState<"all" | "pending" | "answered">(initialFilters?.reply ?? "all");

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

  const inquiries = state.status === "ready" ? state.inquiries : [];
  const pendingCount = inquiries.filter((inq) => !inq.replyMessage).length;

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const start = startDate ? new Date(`${startDate}T00:00:00`) : null;
    const end = endDate ? new Date(`${endDate}T23:59:59.999`) : null;
    return inquiries.filter((inq) => {
      const created = new Date(inq.createdAt);
      if (start && created < start) return false;
      if (end && created > end) return false;
      if (replyFilter === "pending" && inq.replyMessage) return false;
      if (replyFilter === "answered" && !inq.replyMessage) return false;
      if (!normalizedQuery) return true;
      const haystack = [
        inq.name,
        inq.email,
        inq.phone ?? "",
        inq.message,
        inq.orderId ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [endDate, inquiries, query, replyFilter, startDate]);

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
            전체 {inquiries.length} · 답변 대기 {pendingCount} · 필터 {filtered.length}
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
            value={replyFilter}
            onChange={(event) => setReplyFilter(event.target.value as typeof replyFilter)}
            className="h-9 rounded-md border border-neutral-300 bg-white px-2 text-xs text-neutral-700"
          >
            <option value="all">전체</option>
            <option value="pending">답변 대기</option>
            <option value="answered">답변 완료</option>
          </select>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="이름/이메일/내용 검색"
            className="h-9 w-56 rounded-md border border-neutral-300 bg-white px-3 text-xs text-neutral-700"
          />
          {(query || startDate || endDate || replyFilter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setStartDate("");
                setEndDate("");
                setReplyFilter("all");
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
          {filtered.map((inq) => {
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
          {filtered.length === 0 && (
            <tr>
              <td className="px-4 py-6 text-center text-neutral-500" colSpan={6}>
                조건에 맞는 문의가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
