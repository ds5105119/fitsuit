import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getConciergeOrderForUser, getUserProfileByEmail, listInquiriesForUser } from "@/lib/db/queries";
import { cn } from "@/lib/utils";
import { MyPageInquiryDialog } from "./mypage-inquiry-dialog";

function formatDate(input: Date) {
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
  }).format(input);
}

function formatDateTime(input: Date) {
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(input);
}

export async function MyPageContact({ orderId }: { orderId?: string }) {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) {
    redirect("/mypage/login?callbackUrl=/mypage/contact");
  }

  const [profile, inquiries] = await Promise.all([
    getUserProfileByEmail(email),
    listInquiriesForUser(email),
  ]);

  let order = null;
  let orderError = false;
  if (orderId) {
    const found = await getConciergeOrderForUser({ id: orderId, userEmail: email });
    if (found) {
      order = {
        id: found.id,
      };
    } else {
      orderError = true;
    }
  }

  const userName = profile?.userName ?? session?.user?.name ?? "고객";
  const phone = profile?.phone ?? "";

  return (
    <section className="flex-1 space-y-6">
      <div className="flex flex-col gap-3 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-lg font-bold">문의 내역</p>
          <p className="text-xs text-neutral-500">답변은 알림 없이 내역에서 확인 가능합니다.</p>
        </div>
        <MyPageInquiryDialog
          email={email}
          userName={userName}
          phone={phone}
          order={order}
          orderError={orderError}
          defaultOpen={Boolean(orderId)}
          triggerLabel="문의 작성"
          triggerClassName="rounded-md bg-sky-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-sky-400"
        />
      </div>

      <div className="space-y-4">
        {inquiries.map((inq) => (
          <div key={inq.id} className="flex flex-col rounded-xl border border-neutral-200 bg-white p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm lg:text-base font-semibold">{formatDate(new Date(inq.createdAt))}</p>
                <p className="text-xs text-neutral-500">문의 번호: {inq.id.slice(0, 8).toUpperCase()}</p>
              </div>
              <div className="flex items-center gap-2">
                {inq.orderId ? (
                  <span className="rounded-md bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-600">
                    주문 문의
                  </span>
                ) : (
                  <span className="rounded-md bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-500">
                    일반 문의
                  </span>
                )}
                <span
                  className={cn(
                    "rounded-md px-3 py-1 text-xs font-semibold",
                    inq.replyMessage ? "bg-sky-100 text-sky-600" : "bg-amber-100 text-amber-600"
                  )}
                >
                  {inq.replyMessage ? "답변 완료" : "답변 대기"}
                </span>
              </div>
            </div>

            {inq.orderId && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-blue-50 px-4 py-3 text-sm">
                <div>
                  <p className="text-xs text-neutral-500">주문번호</p>
                  <p className="text-sm font-semibold text-neutral-900">{inq.orderId.slice(0, 8).toUpperCase()}</p>
                </div>
                <Link href={`/mypage/orders/${inq.orderId}`} className="text-xs font-semibold text-sky-600 hover:underline">
                  주문 상세 보기 →
                </Link>
              </div>
            )}

            <div className="rounded-lg bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
              {inq.message}
            </div>

            {inq.replyMessage ? (
              <div className="rounded-lg bg-blue-50 px-4 py-3 text-sm text-neutral-700">
                <p className="text-xs font-semibold text-neutral-500">
                  관리자 답변 · {inq.replyUpdatedAt ? formatDateTime(new Date(inq.replyUpdatedAt)) : "방금 전"}
                </p>
                <p className="mt-2 whitespace-pre-line">{inq.replyMessage}</p>
              </div>
            ) : (
              <div className="text-xs text-neutral-500">
                답변이 등록되면 이곳에서 확인할 수 있습니다.
              </div>
            )}
          </div>
        ))}

        {inquiries.length === 0 && (
          <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center text-sm text-neutral-500">
            아직 접수된 문의가 없습니다. 주문 상세 또는 문의 작성에서 문의를 남겨주세요.
          </div>
        )}
      </div>
    </section>
  );
}
