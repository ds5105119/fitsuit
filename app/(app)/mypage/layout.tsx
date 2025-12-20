import { auth } from "@/auth";
import { LoginDialog } from "@/components/login-dialog";
import MyPageSidebar from "@/components/mypage/mypage-sidebar";
import { SuspenseSkeleton } from "@/components/suspense-skeleton";
import { getUserProfileByEmail, listConciergeOrdersForUser } from "@/lib/db/queries";
import { Suspense } from "react";

async function MypageLayoutLoader({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) {
    return (
      <main className="mt-16 lg:mt-20 min-h-[calc(100vh-4rem)] bg-white text-neutral-900">
        <div className="mx-auto h-full max-w-6xl px-6 py-6 lg:py-10">
          <div className="lg:mt-8 flex">
            <MyPageSidebar orders={undefined} session={undefined} />

            <LoginDialog defaultOpen={true} callbackUrl="/mypage/orders" />
          </div>
        </div>
      </main>
    );
  }

  const [orders, profile] = await Promise.all([listConciergeOrdersForUser(email), getUserProfileByEmail(email)]);
  const profileSummary = profile
    ? {
        userName: profile.userName,
      }
    : undefined;

  return (
    <main className="mt-16 lg:mt-20 min-h-[calc(100vh-4rem)] bg-white text-neutral-900">
      <div className="mx-auto h-full max-w-6xl px-6 py-6 lg:py-10">
        <div className="lg:mt-8 flex">
          <MyPageSidebar orders={orders} session={session} profile={profileSummary} />

          {children}
        </div>
      </div>
    </main>
  );
}

export default async function MypageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense fallback={<SuspenseSkeleton />}>
      <MypageLayoutLoader>{children}</MypageLayoutLoader>
    </Suspense>
  );
}
