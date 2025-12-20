import Link from "next/link";
import NextImage from "next/image";
import { redirect } from "next/navigation";
import { getConciergeOrderById } from "@/lib/db/queries";
import { auth } from "@/auth";
import { OrderCancelButton } from "@/components/mypage/order-cancel-button";

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

export async function OrderDetail({ id }: { id: string }) {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) {
    redirect("/mypage/orders");
  }

  if (!id) {
    redirect("/mypage/orders");
  }

  let order = null;
  try {
    order = await getConciergeOrderById(id);
  } catch (error) {
    console.error("Failed to load order", error);
    redirect("/mypage/orders");
  }

  if (!order) {
    redirect("/mypage/orders");
  }

  // Block access to other users' orders
  if (order.userEmail && order.userEmail !== email) {
    redirect("/mypage/orders");
  }

  const selections = Array.isArray(order.selections) ? order.selections : [];
  const rawMeasurements = order.measurements && typeof order.measurements === "object" ? (order.measurements as Record<string, string>) : null;
  const measurementEntries = rawMeasurements ? Object.entries(rawMeasurements).filter(([, v]) => Boolean(String(v).trim())) : [];
  const measurements = measurementEntries.length ? rawMeasurements : null;

  const hero = (order.previewUrl as string | null) || (order.backgroundPreview as string | null) || (order.originalUpload as string | null) || null;

  return (
    <section className="flex-1">
      <div className="flex items-center justify-between pb-4">
        <p className="text-lg font-bold">주문/배송 상세</p>
        <Link href="/mypage/orders" className="text-sm text-neutral-600 hover:underline">
          ← 주문 목록
        </Link>
      </div>

      <div className="flex items-center justify-between px-4 py-4 bg-neutral-50 rounded-xl">
        <p className="mt-1 text-neutral-600">
          주문번호 <span className="font-semibold text-black">{order.id.slice(0, 8).toUpperCase()}</span> · 주문일자
          <span className="font-semibold text-black"> {formatDate(new Date(order.createdAt))}</span>
        </p>
        <span className="text-sm font-semibold bg-sky-100 text-sky-600 px-5 lg:px-8 py-2 rounded-md">{order.status}</span>
      </div>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row">
        <div className="bg-neutral-50 rounded-xl p-4 flex flex-col space-y-4 w-full lg:min-w-90 lg:w-90 h-fit">
          <div>
            <p className="text-base font-bold">주문 이미지</p>
            <p className="text-sm text-neutral-500">접수 시점의 AI 프리뷰입니다.</p>
          </div>
          <div className="relative aspect-4/3 w-full overflow-hidden bg-neutral-100">
            {hero ? (
              <NextImage alt="주문 프리뷰" src={hero} fill className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-neutral-500">이미지 없음</div>
            )}
          </div>
          <div className="text-sm">
            <div className="flex justify-between py-1">
              <span className="text-neutral-500">진행상태</span>
              <span className="font-semibold">{order.status}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-neutral-500">견적 금액</span>
              <span className="font-semibold">{formatPrice(order.price)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-neutral-500">고객</span>
              <span className="font-semibold">{session?.user?.name ?? "-"}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-neutral-500">이메일</span>
              <span className="font-semibold">{email}</span>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <section className="border-t border-neutral-200 bg-white">
            <div className="border-b border-neutral-200 px-4 py-4">
              <p className="text-sm font-semibold">주문 구성</p>
              <p className="text-xs text-neutral-500">선택한 옵션 요약입니다.</p>
            </div>
            <div className="divide-y divide-neutral-200">
              {selections.map((s: any, idx: number) => (
                <div key={`${s?.category ?? "item"}-${idx}`} className="px-4 py-3 text-sm">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="font-semibold">{String(s?.category ?? "옵션")}</span>
                    <span className="text-xs text-neutral-500">{s?.group ? String(s.group) : ""}</span>
                  </div>
                  <div className="mt-1 text-neutral-700">
                    {String(s?.title ?? "")}
                    {s?.subtitle ? <span className="text-neutral-500"> · {String(s.subtitle)}</span> : null}
                  </div>
                </div>
              ))}
              {selections.length === 0 && <div className="px-4 py-8 text-center text-sm text-neutral-500">저장된 옵션이 없습니다.</div>}
            </div>
          </section>

          <section className="border-t border-neutral-200 bg-white">
            <div className="border-b border-neutral-200 px-4 py-4">
              <p className="text-sm font-semibold">사이즈 정보</p>
              <p className="text-xs text-neutral-500">입력한 신체 치수입니다.</p>
            </div>
            <div className="px-4 py-4 text-sm">
              {measurements ? (
                <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                  {measurementEntries.map(([k, v]) => (
                    <div key={k} className="flex justify-between border-b border-neutral-200 py-2">
                      <span className="text-neutral-500">{k}</span>
                      <span className="font-semibold text-neutral-800">{v}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-neutral-500">입력된 사이즈 정보가 없습니다.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
