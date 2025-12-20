import { Suspense } from "react";
import { AdminInquiryDetail } from "@/components/admin/admin-inquiry-detail";

export const metadata = {
  title: "Admin | Inquiry",
};

async function AdminInquiryDetailLoader({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminInquiryDetail inquiryId={id} />;
}

export default function AdminInquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <main className="min-h-screen w-full bg-neutral-50 px-4 py-6 text-neutral-900 md:px-10 md:py-8">
      <Suspense fallback={<div className="rounded-2xl border border-neutral-200 bg-white p-6 text-sm text-neutral-500">로딩 중...</div>}>
        <AdminInquiryDetailLoader params={params} />
      </Suspense>
    </main>
  );
}
