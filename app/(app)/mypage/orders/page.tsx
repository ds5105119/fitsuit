import { MyPageContent } from "@/components/mypage/mypage-content";
import { Suspense } from "react";

export const metadata = {
  title: "마이페이지 | GOLD FINGER",
};

export default function MyPage() {
  return (
    <Suspense fallback={null}>
      <MyPageContent />
    </Suspense>
  );
}
