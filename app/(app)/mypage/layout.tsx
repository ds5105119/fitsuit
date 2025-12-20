import { auth } from "@/auth";
import { LoginDialog } from "@/components/login-dialog";
import MyPageSidebar from "@/components/mypage/mypage-sidebar";
import { SuspenseSkeleton } from "@/components/suspense-skeleton";
import { listConciergeOrdersForUser } from "@/lib/db/queries";
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
        <div className="mx-auto h-full max-w-6xl px-6 py-10">
          <div className="mt-8 flex space-x-10">
            <MyPageSidebar orders={undefined} session={undefined} />

            <LoginDialog defaultOpen={true} callbackUrl="/mypage/orders" />
          </div>
        </div>
      </main>
    );
  }

  const orders = await listConciergeOrdersForUser(email);

  return (
    <main className="mt-16 lg:mt-20 min-h-[calc(100vh-4rem)] bg-white text-neutral-900">
      <div className="mx-auto h-full max-w-6xl px-6 py-10">
        <div className="mt-8 flex space-x-10">
          <MyPageSidebar orders={orders} session={session} />

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
  <Suspense fallback={<SuspenseSkeleton />}>
    <MypageLayoutLoader>{children}</MypageLayoutLoader>
  </Suspense>;
}
