import { redirect } from "next/navigation";
import { auth, signIn } from "@/auth";

export async function LoginForm({ searchParams }: { searchParams: Promise<{ callbackUrl?: string }> }) {
  const session = await auth();

  const { callbackUrl } = await searchParams;
  const next = callbackUrl && callbackUrl.startsWith("/") ? callbackUrl : "/mypage/orders";

  if (session?.user?.email) {
    redirect(next);
  }

  return (
    <>
      <main className="mt-16 lg:mt-20 min-h-[calc(100vh-4rem)] bg-neutral-50 text-neutral-900 flex items-center justify-center">
        <div className="w-lg">
          <h2 className="text-center px-5 py-6 text-xl font-bold sm:px-6">
            로그인하고 <br />
            간편하게 비스포크 시작하기
          </h2>
          <div className="flex-1 px-5 py-6 sm:px-6">
            <form
              action={async () => {
                "use server";
                await signIn("google", { redirectTo: next });
              }}
            >
              <button
                type="submit"
                className="inline-flex h-11 w-full items-center justify-center border border-neutral-300 bg-neutral-900 px-4 text-sm font-semibold text-white hover:bg-neutral-800"
              >
                Google로 로그인
              </button>
            </form>
          </div>
          <div className="pb-4">
            <p className="mt-3 text-xs text-neutral-500 text-center">로그인 시 이용약관 및 개인정보처리방침에 동의한 것으로 간주됩니다.</p>
          </div>
        </div>
      </main>
    </>
  );
}
