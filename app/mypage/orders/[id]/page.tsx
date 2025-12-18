import { Suspense } from "react";
import { OrderDetailContent } from "@/app/mypage/_components/order-detail-content";
import { MyPageSkeleton } from "@/app/mypage/_components/mypage-skeleton";

export const metadata = {
  title: "주문 상세 | GOLD FINGER",
};

export default function OrderDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<MyPageSkeleton />}>
      <OrderDetailContent params={params} />
    </Suspense>
  );
}
