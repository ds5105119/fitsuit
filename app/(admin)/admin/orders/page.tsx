import { Suspense } from "react";
import { AdminOrdersDashboard } from "@/components/admin/admin-orders-dashboard";

export const metadata = {
  title: "Admin | Orders",
};

async function AdminOrdersLoader({
  searchParams,
}: {
  searchParams: Promise<{ status?: string | string[]; q?: string | string[]; start?: string | string[]; end?: string | string[] }>;
}) {
  const resolved = await searchParams;
  const initialFilters = {
    status: typeof resolved?.status === "string" ? resolved.status : undefined,
    q: typeof resolved?.q === "string" ? resolved.q : undefined,
    start: typeof resolved?.start === "string" ? resolved.start : undefined,
    end: typeof resolved?.end === "string" ? resolved.end : undefined,
  };
  return <AdminOrdersDashboard initialFilters={initialFilters} />;
}

export default function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string | string[]; q?: string | string[]; start?: string | string[]; end?: string | string[] }>;
}) {
  return (
    <main className="min-h-screen w-full bg-neutral-50 px-4 py-6 text-neutral-900 md:px-10 md:py-8">
      <div className="mb-6">
        <p className="text-xs font-semibold tracking-[0.18em] text-neutral-500">ORDERS</p>
        <h1 className="text-2xl font-bold text-neutral-900">컨시어지 주문 관리</h1>
        <p className="text-sm text-neutral-500">주문 목록을 확인하고 상세로 이동하세요.</p>
      </div>
      <Suspense fallback={<div className="rounded-2xl border border-neutral-200 bg-white p-4 text-sm text-neutral-500">로딩 중...</div>}>
        <AdminOrdersLoader searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
