import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getConciergeOrderForUser, getUserProfileByEmail, listInquiriesForUser } from "@/lib/db/queries";
import { cn } from "@/lib/utils";
import { MyPageInquiryDialog } from "./mypage-inquiry-dialog";
import { MyPageInquiryDeleteButton } from "./mypage-inquiry-delete-button";

function formatDate(input: Date) {
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
  }).format(input);
}

export async function MyPageContact({ orderId }: { orderId?: string }) {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) {
    redirect("/mypage/login?callbackUrl=/mypage/contact");
  }

  const [profile, inquiries] = await Promise.all([getUserProfileByEmail(email), listInquiriesForUser(email)]);

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

  const phone = profile?.phone ?? "";

  return (
    <section className="flex-1 space-y-6">
      <div className="flex flex-col gap-3 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-lg font-bold">문의 내역</p>
          <p className="text-xs text-neutral-500">답변은 알림 없이 내역에서 확인 가능합니다.</p>
        </div>
        <MyPageInquiryDialog
          phone={phone}
          order={order}
          orderError={orderError}
          defaultOpen={Boolean(orderId)}
          triggerLabel="문의 작성"
          triggerClassName="rounded-md bg-sky-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-sky-400"
        />
      </div>

      <div className="space-y-6">
        {inquiries.map((inq) => (
          <div key={inq.id} className="flex flex-col rounded-xl border border-neutral-200 bg-white p-4 space-y-4">
            <div className="flex justify-between rounded-lg bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
              <div className="flex space-x-3">
                <div className="size-[1.7rem] flex items-center justify-center rounded-full bg-black text-white shrink-0">Q</div>
                <div className="mt-1 flex flex-col space-y-2">
                  <p className={cn("w-fit text-sm font-semibold", inq.replyMessage ? "text-sky-600" : "text-neutral-500")}>
                    {inq.replyMessage ? "답변 완료" : "답변 대기"}
                  </p>
                  <p className={cn("w-fit text-xs font-semibold", inq.orderId ? "text-sky-600" : "text-yellow-600")}>
                    {inq.orderId ? "상품 상세 문의" : "일반 문의"}
                  </p>
                  <p>{inq.message}</p>
                  {(() => {
                    const urls = Array.isArray(inq.attachmentUrls) ? inq.attachmentUrls : inq.attachmentUrl ? [inq.attachmentUrl] : [];
                    if (urls.length === 0) return null;
                    return (
                      <div className="flex flex-wrap gap-2">
                        {urls.map((url) => (
                          <a key={url} href={url} target="_blank" rel="noreferrer">
                            <img src={url} alt="문의 첨부 이미지" className="h-20 w-20 rounded-md border border-neutral-200 object-cover" loading="lazy" />
                          </a>
                        ))}
                      </div>
                    );
                  })()}
                  <p className="text-xs font-semibold">{formatDate(new Date(inq.createdAt))}</p>
                </div>
              </div>
              <MyPageInquiryDeleteButton inquiryId={inq.id} className="text-sm h-fit mt-1 text-neutral-500 hover:text-neutral-800" />
            </div>

            <div className="flex rounded-lg bg-neutral-50 px-4 py-3 text-sm text-neutral-700 space-x-3">
              <div className="size-[1.7rem] flex items-center justify-center rounded-full bg-black text-white shrink-0">A</div>
              <div className="mt-1 flex flex-col space-y-2">
                <p className="text-sm font-semibold text-neutral-500">관리자 답변</p>
                <p className="whitespace-pre-line">{inq.replyMessage ?? "아직 답변이 없어요"}</p>
                {inq.replyUpdatedAt && <p className="text-xs font-semibold">{formatDate(new Date(inq.replyUpdatedAt))}</p>}
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
