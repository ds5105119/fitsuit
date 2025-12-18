import { OrderDetailContent } from "@/components/mypage/order-detail-content";
import { SuspenseSkeleton } from "@/components/suspense-skeleton";
import { Suspense } from "react";

export const metadata = {
  title: "주문 상세 | GOLD FINGER",
};

export default function OrderDetail({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<SuspenseSkeleton />}>
      <OrderDetailContent params={params} />
    </Suspense>
  );
}
