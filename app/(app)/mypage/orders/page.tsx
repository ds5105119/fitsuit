import { MyPageOrder } from "@/components/mypage/mypage-order";
import { SuspenseSkeleton } from "@/components/suspense-skeleton";
import { Suspense } from "react";

export const metadata = {
  title: "마이페이지 | GOLD FINGER",
};

export default function MyPage() {
  return (
    <Suspense fallback={<SuspenseSkeleton />}>
      <MyPageOrder />
    </Suspense>
  );
}
