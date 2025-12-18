import { Suspense } from "react";
import { MyPageLoginContent } from "@/app/mypage/_components/mypage-login-content";
import { MyPageSkeleton } from "@/app/mypage/_components/mypage-skeleton";

export const metadata = {
  title: "마이페이지 로그인 | GOLD FINGER",
};

export default function MyPageLogin({ searchParams }: { searchParams: Promise<{ callbackUrl?: string }> }) {
  return (
    <Suspense fallback={<MyPageSkeleton />}>
      <MyPageLoginContent searchParams={searchParams} />
    </Suspense>
  );
}
