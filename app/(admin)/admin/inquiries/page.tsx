import { Suspense } from "react";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export const metadata = {
  title: "Admin | Inquiries",
};

async function AdminInquiriesLoader({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string | string[];
    reply?: string | string[];
    q?: string | string[];
    start?: string | string[];
    end?: string | string[];
    orderId?: string | string[];
    page?: string | string[];
  }>;
}) {
  const resolved = await searchParams;
  const page = typeof resolved?.page === "string" ? Number.parseInt(resolved.page, 10) : undefined;
  const rawReply =
    typeof resolved?.reply === "string"
      ? resolved.reply
      : typeof resolved?.status === "string"
        ? resolved.status
        : undefined;
  const reply =
    rawReply === "pending" || rawReply === "answered" || rawReply === "all"
      ? (rawReply as "pending" | "answered" | "all")
      : undefined;
  const initialFilters = {
    reply,
    q: typeof resolved?.q === "string" ? resolved.q : undefined,
    start: typeof resolved?.start === "string" ? resolved.start : undefined,
    end: typeof resolved?.end === "string" ? resolved.end : undefined,
    orderId: typeof resolved?.orderId === "string" ? resolved.orderId : undefined,
    page: Number.isFinite(page) && page && page > 0 ? page : undefined,
  };
  return <AdminDashboard initialFilters={initialFilters} />;
}

export default function AdminInquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string | string[];
    reply?: string | string[];
    q?: string | string[];
    start?: string | string[];
    end?: string | string[];
    orderId?: string | string[];
    page?: string | string[];
  }>;
}) {
  return (
    <main className="min-h-screen w-full bg-neutral-50 px-4 py-6 text-neutral-900 md:px-10 md:py-8">
      <div className="mb-6">
        <p className="text-xs font-semibold tracking-[0.18em] text-neutral-500">INQUIRIES</p>
        <h1 className="text-2xl font-bold text-neutral-900">문의 관리</h1>
        <p className="text-sm text-neutral-500">고객 문의를 확인하고 필요한 경우 응답하세요.</p>
      </div>
      <Suspense fallback={<div className="rounded-2xl border border-neutral-200 bg-white p-4 text-sm text-neutral-500">로딩 중...</div>}>
        <AdminInquiriesLoader searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
