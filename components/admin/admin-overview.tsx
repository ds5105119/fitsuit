"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Inquiry = {
  id: string;
  createdAt: string;
  orderId: string | null;
  name: string;
  email: string;
  message: string;
  replyMessage: string | null;
};

type ConciergeOrder = {
  id: string;
  createdAt: string;
  userEmail: string;
  userName: string | null;
  status: string;
};

type State =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; orders: ConciergeOrder[]; inquiries: Inquiry[] };

export function AdminOverview() {
  const router = useRouter();
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    const load = async () => {
      const [ordersRes, inquiriesRes] = await Promise.all([
        fetch("/api/admin/orders", { cache: "no-store" }),
        fetch("/api/admin/inquiries", { cache: "no-store" }),
      ]);
      if (ordersRes.status === 401 || inquiriesRes.status === 401) {
        router.replace("/admin/login");
        return;
      }
      if (!ordersRes.ok || !inquiriesRes.ok) {
        setState({ status: "error", message: "불러오기에 실패했습니다." });
        return;
      }
      const ordersData = await ordersRes.json().catch(() => null);
      const inquiriesData = await inquiriesRes.json().catch(() => null);
      setState({
        status: "ready",
        orders: ordersData?.orders ?? [],
        inquiries: inquiriesData?.inquiries ?? [],
      });
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
    return <div className="rounded-2xl border border-neutral-200 bg-white p-4 text-sm text-neutral-500">대시보드 로딩 중...</div>;
  }

  if (state.status === "error") {
    return <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{state.message}</div>;
  }

  const { orders, inquiries } = state;
  const pendingInquiries = inquiries.filter((inq) => !inq.replyMessage);
  const inProgressOrders = orders.filter((order) => !["완료", "취소"].includes(order.status));
  const recentOrders = orders.slice(0, 5);
  const recentInquiries = inquiries.slice(0, 5);

  const today = new Date();
  const todayLabel = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-neutral-200 bg-white p-4">
          <p className="text-xs font-semibold tracking-[0.16em] text-neutral-500">ORDERS</p>
          <p className="mt-2 text-2xl font-semibold text-neutral-900">{orders.length}</p>
          <p className="text-sm text-neutral-500">진행중 {inProgressOrders.length}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <Link href="/admin/orders" className="rounded-full border border-neutral-300 px-3 py-1 text-neutral-600 hover:bg-neutral-50">
              전체 보기
            </Link>
            <Link
              href={`/admin/orders?start=${todayLabel}&end=${todayLabel}`}
              className="rounded-full border border-neutral-300 px-3 py-1 text-neutral-600 hover:bg-neutral-50"
            >
              오늘 주문
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-4">
          <p className="text-xs font-semibold tracking-[0.16em] text-neutral-500">INQUIRIES</p>
          <p className="mt-2 text-2xl font-semibold text-neutral-900">{inquiries.length}</p>
          <p className="text-sm text-neutral-500">답변 대기 {pendingInquiries.length}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <Link href="/admin/inquiries" className="rounded-full border border-neutral-300 px-3 py-1 text-neutral-600 hover:bg-neutral-50">
              전체 보기
            </Link>
            <Link
              href={`/admin/inquiries?reply=pending`}
              className="rounded-full border border-neutral-300 px-3 py-1 text-neutral-600 hover:bg-neutral-50"
            >
              답변 대기
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-4">
          <p className="text-xs font-semibold tracking-[0.16em] text-neutral-500">QUICK LINKS</p>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <Link href="/admin/orders?status=견적%20완료" className="text-neutral-800 underline underline-offset-4">
              견적 완료 주문 보기
            </Link>
            <Link href={`/admin/inquiries?reply=pending&start=${todayLabel}&end=${todayLabel}`} className="text-neutral-800 underline underline-offset-4">
              오늘 답변 대기 문의
            </Link>
            <Link href="/admin/settings" className="text-neutral-800 underline underline-offset-4">
              관리자 설정
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-neutral-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.16em] text-neutral-500">RECENT ORDERS</p>
              <p className="text-sm text-neutral-500">최근 주문 5건</p>
            </div>
            <Link href="/admin/orders" className="text-xs text-neutral-600 underline underline-offset-4">
              전체 보기
            </Link>
          </div>
          <div className="mt-4 space-y-3 text-sm">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between rounded-lg border border-neutral-100 px-3 py-2">
                <div>
                  <p className="font-semibold text-neutral-900">{order.userName || "-"}</p>
                  <p className="text-xs text-neutral-500">{formatter.format(new Date(order.createdAt))}</p>
                </div>
                <Link href={`/admin/orders/${order.id}`} className="text-xs text-neutral-700 underline underline-offset-4">
                  {order.id.slice(0, 8).toUpperCase()}
                </Link>
              </div>
            ))}
            {recentOrders.length === 0 && (
              <div className="rounded-lg border border-neutral-100 px-3 py-6 text-center text-xs text-neutral-500">
                최근 주문이 없습니다.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.16em] text-neutral-500">RECENT INQUIRIES</p>
              <p className="text-sm text-neutral-500">최근 문의 5건</p>
            </div>
            <Link href="/admin/inquiries" className="text-xs text-neutral-600 underline underline-offset-4">
              전체 보기
            </Link>
          </div>
          <div className="mt-4 space-y-3 text-sm">
            {recentInquiries.map((inq) => (
              <div key={inq.id} className="flex items-center justify-between rounded-lg border border-neutral-100 px-3 py-2">
                <div>
                  <p className="font-semibold text-neutral-900">{inq.name}</p>
                  <p className="text-xs text-neutral-500">{formatter.format(new Date(inq.createdAt))}</p>
                </div>
                <Link href={`/admin/inquiries/${inq.id}`} className="text-xs text-neutral-700 underline underline-offset-4">
                  {inq.id.slice(0, 8).toUpperCase()}
                </Link>
              </div>
            ))}
            {recentInquiries.length === 0 && (
              <div className="rounded-lg border border-neutral-100 px-3 py-6 text-center text-xs text-neutral-500">
                최근 문의가 없습니다.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
