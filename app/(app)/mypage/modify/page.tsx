import { Suspense } from "react";
import { MyPageModify } from "@/components/mypage/mypage-modify";
import { SuspenseSkeleton } from "@/components/suspense-skeleton";

export const metadata = {
  title: "내 정보 수정 | GOLD FINGER",
};

export default function MyPageModifyPage() {
  return (
    <Suspense fallback={<SuspenseSkeleton />}>
      <MyPageModify />
    </Suspense>
  );
}
