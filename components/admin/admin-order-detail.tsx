"use client";

import NextImage from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ConciergeOrder = {
  id: string;
  createdAt: string;
  userEmail: string;
  userName: string | null;
  status: string;
  selections: any;
  measurements: any;
  previewUrl: string | null;
  originalUpload: string | null;
  backgroundPreview: string | null;
};

type State =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; order: ConciergeOrder };

export function AdminOrderDetail({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [state, setState] = useState<State>({ status: "loading" });
  const [deleting, setDeleting] = useState(false);
  const statuses = ["접수", "취소", "제작중", "완료"];

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        cache: "no-store",
      });
      if (res.status === 401) {
        router.replace("/admin/login");
        return;
      }
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setState({ status: "error", message: data?.error || "불러오기에 실패했습니다." });
        return;
      }
      setState({ status: "ready", order: data?.order });
    };
    load();
  }, [orderId, router]);

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

  const { order } = state;
  const selections = Array.isArray(order.selections) ? order.selections : [];
  const rawMeasurements =
    order.measurements && typeof order.measurements === "object"
      ? (order.measurements as Record<string, string>)
      : null;
  const measurementEntries = rawMeasurements
    ? Object.entries(rawMeasurements).filter(([, v]) => Boolean(String(v).trim()))
    : [];
  const measurements = measurementEntries.length ? rawMeasurements : null;

  const hero =
    order.previewUrl || order.backgroundPreview || order.originalUpload || null;

  const updateStatus = async (nextStatus: string) => {
    if (state.status !== "ready") return;
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      toast.error(data?.error || "상태 변경에 실패했습니다.");
      return;
    }
    toast.success("상태가 변경되었습니다.");
    setState({ status: "ready", order: data.order });
  };

  const deleteOrder = async () => {
    if (state.status !== "ready" || deleting) return;
    const ok = window.confirm("정말 이 주문을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.");
    if (!ok) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "DELETE",
      });
      if (res.status === 401) {
        router.replace("/admin/login");
        return;
      }
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        toast.error(data?.error || "삭제에 실패했습니다.");
        return;
      }
      toast.success("주문이 삭제되었습니다.");
      router.replace("/admin/orders");
    } catch (error) {
      toast.error("삭제 중 오류가 발생했습니다.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-neutral-500">Order</p>
          <h1 className="text-3xl font-semibold tracking-wide text-neutral-900">주문 상세</h1>
          <p className="text-sm text-neutral-500">
            {formatter.format(new Date(order.createdAt))} · {order.id.slice(0, 8).toUpperCase()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={deleteOrder}
            disabled={deleting}
            className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleting ? "삭제 중..." : "주문 삭제"}
          </button>
          <Link
            href="/admin/orders"
            className="rounded-full border border-neutral-300 px-4 py-2 text-sm text-neutral-800 hover:bg-neutral-100"
          >
            ← 목록
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[420px_minmax(0,1fr)]">
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
          <div className="border-b border-neutral-200 px-4 py-3">
            <p className="text-sm font-semibold text-neutral-900">프리뷰</p>
            <p className="text-xs text-neutral-500">접수 시점 이미지</p>
          </div>
          <div className="px-4 py-4">
            <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-black/30">
              {hero ? (
                <NextImage alt="order preview" src={hero} fill className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-sm">
                  이미지 없음
                </div>
              )}
            </div>
            <div className="mt-4 border-t border-neutral-200 pt-4 text-sm text-neutral-900">
              <div className="flex justify-between py-1">
                <span className="text-neutral-600">고객</span>
                <span className="font-semibold">{order.userName || "-"}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-neutral-600">이메일</span>
                <span className="font-semibold">{order.userEmail}</span>
              </div>
              <div className="flex items-center justify-between py-2 gap-2">
                <div className="text-neutral-600">상태</div>
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(e.target.value)}
                  className="h-9 rounded-md border border-neutral-300 bg-white px-3 text-sm font-semibold text-neutral-900"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
            <div className="border-b border-neutral-200 px-4 py-3">
              <p className="text-sm font-semibold text-neutral-900">주문 구성</p>
              <p className="text-xs text-neutral-500">선택 옵션</p>
            </div>
            <div className="divide-y divide-neutral-100">
              {selections.map((s: any, idx: number) => (
                <div key={`${s?.category ?? "item"}-${idx}`} className="px-4 py-3 text-sm">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="font-semibold text-neutral-900">{String(s?.category ?? "옵션")}</span>
                    <span className="text-xs text-neutral-500">{s?.group ? String(s.group) : ""}</span>
                  </div>
                  <div className="mt-1 text-neutral-800">
                    {String(s?.title ?? "")}
                    {s?.subtitle ? <span className="text-neutral-600"> · {String(s.subtitle)}</span> : null}
                  </div>
                </div>
              ))}
              {selections.length === 0 && (
                <div className="px-4 py-8 text-center text-sm text-neutral-500">
                  저장된 옵션이 없습니다.
                </div>
              )}
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
            <div className="border-b border-neutral-200 px-4 py-3">
              <p className="text-sm font-semibold text-neutral-900">사이즈</p>
              <p className="text-xs text-neutral-500">입력 치수</p>
            </div>
            <div className="px-4 py-4 text-sm">
              {measurements ? (
                <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                  {measurementEntries.map(([k, v]) => (
                    <div key={k} className="flex justify-between border-b border-neutral-100 py-2">
                      <span className="text-neutral-500">{k}</span>
                      <span className="font-semibold text-neutral-900">{v}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-neutral-500">입력된 사이즈 정보가 없습니다.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
