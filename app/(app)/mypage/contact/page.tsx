import { Suspense } from "react";
import { MyPageContact } from "@/components/mypage/mypage-contact";
import { SuspenseSkeleton } from "@/components/suspense-skeleton";

export const metadata = {
  title: "문의 내역 | GOLD FINGER",
};

async function ContactPageLoader({ params }: { params: Promise<{ orderId?: string }> }) {
  const { orderId } = await params;
  return <MyPageContact orderId={orderId} />;
}

export default function ContactPage({ params }: { params: Promise<{ orderId?: string }> }) {
  return (
    <Suspense fallback={<SuspenseSkeleton />}>
      <ContactPageLoader params={params} />
    </Suspense>
  );
}
