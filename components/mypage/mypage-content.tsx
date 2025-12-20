import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { listConciergeOrdersForUser } from "@/lib/db/queries";
import { auth } from "@/auth";
import { OrderCancelButton } from "./order-cancel-button";
import { cn } from "@/lib/utils";

function formatDate(input: Date) {
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
  }).format(input);
}

function formatPrice(price: number | null) {
  if (typeof price !== "number" || !Number.isFinite(price)) {
    return "견적 준비중";
  }
  return `${new Intl.NumberFormat("ko-KR").format(price)}원`;
}

export async function MyPageContent() {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) {
    redirect("/mypage/login?callbackUrl=/mypage");
  }

  const orders = await listConciergeOrdersForUser(email);

  return (
    <section className="flex-1">
      <div className="w-full flex flex-col space-y-2 lg:flex-row lg:space-y-0 lg:justify-between lg:items-center pb-4">
        <p className="text-lg font-bold">주문/배송 조회</p>
        <p className="text-xs text-neutral-500">모든 제작 상품은 상황에 따라 분리배송 될 수 있어요.</p>
      </div>

      <div className="overflow-x-auto space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="flex flex-col border border-neutral-200 rounded-xl p-4 space-y-4">
            <div className="w-full flex justify-between items-center">
              <div>
                <p className="text-sm lg:text-base font-semibold">{formatDate(order.createdAt)}</p>
                <p className="hidden lg:block text-xs text-neutral-500">주문 번호: {order.id.slice(0, 8).toUpperCase()}</p>
                <p className="lg:hidden text-xs text-neutral-500">{order.id.slice(0, 8).toUpperCase()}</p>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <span className="text-sm font-semibold bg-sky-100 text-sky-600 px-5 py-2 rounded-md">{order.status}</span>
                <Link
                  href={`/mypage/orders/${order.id}`}
                  className="text-sm font-semibold shadow-[inset_0_0_0_1px_rgb(229_229_229)] px-5 py-2 rounded-md hover:bg-neutral-100"
                >
                  자세히 보기
                </Link>
              </div>
            </div>

            <hr className="border-neutral-200" />

            <div className="w-full flex flex-col lg:flex-row justify-between items-center">
              <div className="flex w-full lg:w-fit items-center space-x-4">
                <div className="relative h-28 w-28 rounded-md aspect-square overflow-hidden shrink-0">
                  <Image src={`${order.previewUrl}`} alt="주문 이미지" fill className="object-cover" />
                </div>
                <div className="flex flex-col lg:w-96">
                  <p className="text-base font-semibold mb-2">비스포크 정장</p>
                  <p className="hidden lg:block text-sm text-neutral-500">
                    옵션:
                    {String(
                      order.selections
                        .filter((item) => ["원단", "재킷", "바지", "셔츠"].includes(item.category))
                        .map((item) => ` ${item.group ? `${item.category}-${item.group}` : item.category}: ${item.title}`)
                    )}
                  </p>
                </div>
              </div>

              <div className="lg:hidden rounded-lg bg-blue-50 p-4 my-4">
                <p className="text-sm text-neutral-500">
                  옵션:
                  {String(
                    order.selections
                      .filter((item) => ["원단", "재킷", "바지", "셔츠"].includes(item.category))
                      .map((item) => ` ${item.group ? `${item.category}-${item.group}` : item.category}: ${item.title}`)
                  )}
                </p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-1 items-center gap-2 w-full lg:w-fit">
                <OrderCancelButton
                  orderId={order.id}
                  status={order.status}
                  className="col-span-1 flex items-center justify-center text-sm font-semibold shadow-[inset_0_0_0_1px_rgb(229_229_229)] py-2 lg:w-36 rounded-md hover:bg-neutral-100"
                />
                <Link
                  href={`/mypage/orders/${order.id}`}
                  className="col-span-1 flex items-center justify-center text-sm font-semibold shadow-[inset_0_0_0_1px_var(--color-sky-500)] py-2 lg:w-36 rounded-md hover:bg-sky-100 text-sky-500"
                >
                  문의하기
                </Link>
                <button
                  className={cn(
                    "col-span-full hidden items-center justify-center text-sm font-semibold bg-sky-500 text-white py-2 lg:w-36 rounded-md hover:bg-sky-400",
                    order.status === "견적 완료" && "flex!"
                  )}
                >
                  결제하기
                </button>
              </div>
            </div>

            <hr className="border-neutral-200" />

            <div className="flex justify-between rounded-lg bg-blue-50 p-4">
              <div />
              <p className="text-neutral-500">
                총 결제금액: <span className="font-semibold text-black">{formatPrice(order.price)}</span>
              </p>
            </div>
          </div>
        ))}
        {orders.length === 0 && (
          <tr>
            <td colSpan={5} className="px-4 py-10 text-center text-neutral-500">
              아직 주문이 없습니다. AI 정장 맞추기에서 컨시어지 주문을 전송해 보세요.
            </td>
          </tr>
        )}
      </div>
    </section>
  );
}
