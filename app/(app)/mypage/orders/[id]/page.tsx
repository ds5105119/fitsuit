import { Suspense } from "react";
import { OrderDetailContent } from "@/components/mypage/order-detail-content";
import { SuspenseSkeleton } from "@/components/suspense-skeleton";

export const metadata = {
  title: "주문 상세 | GOLD FINGER",
};

async function OrderDetailIdLoader({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <OrderDetailContent id={id} />;
}

export default function OrderDetail({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<SuspenseSkeleton />}>
      <OrderDetailIdLoader params={params} />
    </Suspense>
  );
}
