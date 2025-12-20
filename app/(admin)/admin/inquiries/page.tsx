import { AdminDashboard } from "@/components/admin/admin-dashboard";

export const metadata = {
  title: "Admin | Inquiries",
};

export default function AdminInquiriesPage() {
  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-6 text-neutral-900 md:px-10 md:py-8">
      <div className="mb-6">
        <p className="text-xs font-semibold tracking-[0.18em] text-neutral-500">INQUIRIES</p>
        <h1 className="text-2xl font-bold text-neutral-900">문의 관리</h1>
        <p className="text-sm text-neutral-500">고객 문의를 확인하고 필요한 경우 응답하세요.</p>
      </div>
      <AdminDashboard />
    </main>
  );
}
