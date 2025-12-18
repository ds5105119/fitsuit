import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signIn } from "@/auth";

export async function MyPageLoginContent({ searchParams }: { searchParams: Promise<{ callbackUrl?: string }> }) {
  const session = await auth();
  if (session?.user?.email) {
    redirect("/mypage");
  }

  const { callbackUrl } = await searchParams;
  const next = callbackUrl && callbackUrl.startsWith("/") ? callbackUrl : "/mypage";

  return (
    <main className="mt-16 lg:mt-20 min-h-[calc(100vh-4rem)] bg-neutral-50 text-neutral-900">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
          <div>
            <p className="text-xs tracking-[0.24em] text-neutral-500">MY</p>
            <h1 className="text-2xl font-bold">마이페이지</h1>
            <p className="mt-1 text-sm text-neutral-600">주문 조회를 위해 로그인해 주세요.</p>
          </div>
          <Link href="/" className="text-sm text-neutral-600 hover:underline">
            홈으로
          </Link>
        </div>

        <div className="mt-8">
          <div className="border-t border-neutral-200 bg-white">
            <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-4">
              <div>
                <p className="text-sm font-semibold">간편 로그인</p>
                <p className="text-xs text-neutral-500">Google 계정으로 주문 내역을 안전하게 확인합니다.</p>
              </div>
            </div>

            <div className="px-4 py-6">
              <form
                action={async () => {
                  "use server";
                  await signIn();
                }}
              >
                <button
                  type="submit"
                  className="inline-flex h-11 w-full items-center justify-center border border-neutral-300 bg-neutral-900 px-4 text-sm font-semibold text-white hover:bg-neutral-800"
                >
                  Sign in
                </button>
              </form>
              <p className="mt-3 text-xs text-neutral-500">로그인 시 이용약관 및 개인정보처리방침에 동의한 것으로 간주됩니다.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
