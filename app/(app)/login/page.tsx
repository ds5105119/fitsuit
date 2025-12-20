import { Suspense } from "react";
import { LoginForm } from "@/components/login-form";
import { SuspenseSkeleton } from "@/components/suspense-skeleton";

export const metadata = {
  title: "마이페이지 로그인 | GOLD FINGER",
};

export default function MyPageLogin({ searchParams }: { searchParams: Promise<{ callbackUrl?: string }> }) {
  return (
    <Suspense fallback={<SuspenseSkeleton />}>
      <LoginForm searchParams={searchParams} />
    </Suspense>
  );
}
