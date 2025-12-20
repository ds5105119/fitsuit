import { AdminOverview } from "@/components/admin/admin-overview";

export const metadata = {
  title: "Admin | Overview",
};

export default function AdminHome() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-neutral-50 text-neutral-900">
      <header className="border-b border-neutral-200 bg-white px-4 py-4 md:px-8">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold tracking-[0.18em] text-neutral-500">ADMIN OVERVIEW</p>
          <h1 className="text-2xl font-bold">관리 콘솔</h1>
          <p className="text-sm text-neutral-500">주문과 문의 현황을 빠르게 확인하세요.</p>
        </div>
      </header>
      <main className="flex-1 px-4 py-6 md:px-10 md:py-8">
        <AdminOverview />
      </main>
    </div>
  );
}
