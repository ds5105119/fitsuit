import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { MyPageLoginDialog } from "@/components/mypage/mypage-login-dialog";

export async function MyPageLoginContent({ searchParams }: { searchParams: Promise<{ callbackUrl?: string }> }) {
  const session = await auth();
  if (session?.user?.email) {
    redirect("/mypage");
  }

  const { callbackUrl } = await searchParams;
  const next = callbackUrl && callbackUrl.startsWith("/") ? callbackUrl : "/mypage";

  return (
    <>
      <main className="mt-16 lg:mt-20 min-h-[calc(100vh-4rem)] bg-neutral-50 text-neutral-900">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <div className="border-b border-neutral-200 pb-4">
            <p className="text-xs tracking-[0.24em] text-neutral-500">MY</p>
            <h1 className="text-2xl font-bold">마이페이지</h1>
            <p className="mt-1 text-sm text-neutral-600">
              로그인 후 주문/배송 조회가 가능합니다.
            </p>
          </div>
          <div className="mt-8 text-sm text-neutral-500">
            로그인 팝업이 자동으로 열리지 않았다면 새로고침 해주세요.
          </div>
        </div>
      </main>

      <MyPageLoginDialog defaultOpen callbackUrl={next} onCloseHref="/" />
    </>
  );
}
