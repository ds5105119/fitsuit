import { Suspense } from "react";
import { OrderDetail } from "@/components/mypage/mypage-order-detail";
import { SuspenseSkeleton } from "@/components/suspense-skeleton";

export const metadata = {
  title: "주문 상세 | GOLD FINGER",
};

async function OrderDetailIdLoader({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <OrderDetail id={id} />;
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<SuspenseSkeleton />}>
      <OrderDetailIdLoader params={params} />
    </Suspense>
  );
}
