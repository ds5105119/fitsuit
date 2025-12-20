import { Suspense } from "react";
import { OrderDetailContent } from "@/components/mypage/order-detail-content";

export const metadata = {
  title: "주문 상세 | GOLD FINGER",
};

export default async function OrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <Suspense fallback={null}>
      <OrderDetailContent id={id} />
    </Suspense>
  );
}
