import { signOut } from "@/auth";
import { MyPageContent } from "@/components/mypage/mypage-content";
import { SuspenseSkeleton } from "@/components/suspense-skeleton";
import { Suspense } from "react";

export const metadata = {
  title: "마이페이지 | GOLD FINGER",
};

export default function MyPage() {
  return (
    <Suspense fallback={<SuspenseSkeleton />}>
      <MyPageContent />
    </Suspense>
  );
}
