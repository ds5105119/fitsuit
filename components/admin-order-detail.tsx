"use client";

import NextImage from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-amber-200">
            Order
          </p>
          <h1 className="text-3xl font-semibold tracking-wide text-white">
            주문 상세
          </h1>
          <p className="text-sm text-white/70">
            {formatter.format(new Date(order.createdAt))} ·{" "}
            {order.id.slice(0, 8).toUpperCase()}
          </p>
        </div>
        <Link
          href="/admin"
          className="rounded-full border border-white/20 px-4 py-2 text-sm text-white hover:border-amber-200"
        >
          ← 목록
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[420px_minmax(0,1fr)]">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          <div className="border-b border-white/10 px-4 py-3">
            <p className="text-sm font-semibold text-white">프리뷰</p>
            <p className="text-xs text-white/60">접수 시점 이미지</p>
          </div>
          <div className="px-4 py-4">
            <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-black/30">
              {hero ? (
                <NextImage alt="order preview" src={hero} fill className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-white/60">
                  이미지 없음
                </div>
              )}
            </div>
            <div className="mt-4 border-t border-white/10 pt-4 text-sm">
              <div className="flex justify-between py-1">
                <span className="text-white/60">고객</span>
                <span className="font-semibold text-white">
                  {order.userName || "-"}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-white/60">이메일</span>
                <span className="font-semibold text-white">{order.userEmail}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-white/60">상태</span>
                <span className="font-semibold text-white">{order.status}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <div className="border-b border-white/10 px-4 py-3">
              <p className="text-sm font-semibold text-white">주문 구성</p>
              <p className="text-xs text-white/60">선택 옵션</p>
            </div>
            <div className="divide-y divide-white/10">
              {selections.map((s: any, idx: number) => (
                <div key={`${s?.category ?? "item"}-${idx}`} className="px-4 py-3 text-sm">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="font-semibold text-white">
                      {String(s?.category ?? "옵션")}
                    </span>
                    <span className="text-xs text-white/60">
                      {s?.group ? String(s.group) : ""}
                    </span>
                  </div>
                  <div className="mt-1 text-white/80">
                    {String(s?.title ?? "")}
                    {s?.subtitle ? (
                      <span className="text-white/60"> · {String(s.subtitle)}</span>
                    ) : null}
                  </div>
                </div>
              ))}
              {selections.length === 0 && (
                <div className="px-4 py-8 text-center text-sm text-white/60">
                  저장된 옵션이 없습니다.
                </div>
              )}
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <div className="border-b border-white/10 px-4 py-3">
              <p className="text-sm font-semibold text-white">사이즈</p>
              <p className="text-xs text-white/60">입력 치수</p>
            </div>
            <div className="px-4 py-4 text-sm">
              {measurements ? (
                <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                  {measurementEntries.map(([k, v]) => (
                    <div key={k} className="flex justify-between border-b border-white/10 py-2">
                      <span className="text-white/60">{k}</span>
                      <span className="font-semibold text-white">{v}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white/60">입력된 사이즈 정보가 없습니다.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
