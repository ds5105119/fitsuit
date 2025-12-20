import Link from "next/link";
import { redirect } from "next/navigation";
import { listConciergeOrdersForUser } from "@/lib/db/queries";
import { auth, signOut } from "@/auth";
import { cn } from "@/lib/utils";
import MyPageSidebar from "./mypage-sidebar";

function formatDate(input: Date) {
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(input);
}

export async function MyPageContent() {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) {
    redirect("/mypage/login?callbackUrl=/mypage");
  }

  const orders = await listConciergeOrdersForUser(email);

  return (
    <main className="mt-16 lg:mt-20 min-h-[calc(100vh-4rem)] bg-white text-neutral-900">
      <div className="mx-auto h-full max-w-6xl px-6 py-10">
        <div className="mt-8 flex space-x-10">
          <MyPageSidebar orders={orders} />

          <section className="grow">
            <div className="flex items-start justify-between border-b border-neutral-200 pb-4">
              <div>
                <p className="text-xs tracking-[0.24em] text-neutral-500">MY</p>
                <h1 className="text-2xl font-bold">마이페이지</h1>
                <p className="mt-1 text-sm text-neutral-600">
                  {session?.user?.name ? `${session.user.name}님` : "고객님"} ({email})
                </p>
              </div>
              <div className="flex items-center gap-3">
                <form
                  action={async () => {
                    "use server";
                    await signOut();
                  }}
                >
                  <button className="h-10 px-4 inline-flex items-center border border-neutral-300 bg-white text-sm hover:bg-neutral-100" type="submit">
                    로그아웃
                  </button>
                </form>
              </div>
            </div>

            <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-4">
              <div>
                <p className="text-sm font-semibold">주문/배송 조회</p>
                <p className="text-xs text-neutral-500">AI 컨시어지로 접수한 맞춤 수트 주문 내역입니다.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-neutral-50 text-left">
                  <tr className="border-b border-neutral-200">
                    <th className="px-4 py-3 font-semibold">주문일</th>
                    <th className="px-4 py-3 font-semibold">주문번호</th>
                    <th className="px-4 py-3 font-semibold">상품</th>
                    <th className="px-4 py-3 font-semibold">진행상태</th>
                    <th className="px-4 py-3 font-semibold">상세</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-neutral-200">
                      <td className="px-4 py-3 text-neutral-700">{formatDate(new Date(order.createdAt))}</td>
                      <td className="px-4 py-3 font-mono text-xs text-neutral-700">{order.id.slice(0, 8).toUpperCase()}</td>
                      <td className="px-4 py-3">
                        <div className="font-semibold">AI 맞춤 수트</div>
                        <div className="text-xs text-neutral-500">컨시어지 주문</div>
                      </td>
                      <td className="px-4 py-3 text-neutral-700">{order.status}</td>
                      <td className="px-4 py-3">
                        <Link href={`/mypage/orders/${order.id}`} className="text-neutral-900 underline underline-offset-4">
                          보기
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-10 text-center text-neutral-500">
                        아직 주문이 없습니다. AI 정장 맞추기에서 컨시어지 주문을 전송해 보세요.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
