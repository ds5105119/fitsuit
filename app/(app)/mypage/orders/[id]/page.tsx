import { OrderDetailContent } from "@/components/mypage/order-detail-content";
import { SuspenseSkeleton } from "@/components/suspense-skeleton";

export const metadata = {
  title: "주문 상세 | GOLD FINGER",
};

export default async function OrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <OrderDetailContent id={id} fallback={<SuspenseSkeleton />} />;
}
