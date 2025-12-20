import { AdminOrdersDashboard } from "@/components/admin/admin-orders-dashboard";

export const metadata = {
  title: "Admin | Orders",
};

export default function AdminOrdersPage() {
  return (
    <main className="min-h-screen w-full bg-neutral-50 px-4 py-6 text-neutral-900 md:px-10 md:py-8">
      <div className="mb-6">
        <p className="text-xs font-semibold tracking-[0.18em] text-neutral-500">ORDERS</p>
        <h1 className="text-2xl font-bold text-neutral-900">컨시어지 주문 관리</h1>
        <p className="text-sm text-neutral-500">주문 목록을 확인하고 상세로 이동하세요.</p>
      </div>
      <AdminOrdersDashboard />
    </main>
  );
}
