import { AdminOrderDetail } from "@/components/admin-order-detail";
import { Suspense } from "react";

export const metadata = {
  title: "Admin | Order Detail",
};

async function AdminOrderDetailLoader({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AdminOrderDetail orderId={id} />;
}

export default function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black px-6 py-16 text-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <Suspense
          fallback={
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
              로딩 중...
            </div>
          }
        >
          <AdminOrderDetailLoader params={params} />
        </Suspense>
      </div>
    </main>
  );
}
