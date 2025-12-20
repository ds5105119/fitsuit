import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getConciergeOrderForUser, getUserProfileByEmail, saveInquiry } from "@/lib/db/queries";

const UUID_REGEX = /^[0-9a-fA-F-]{36}$/;

export async function POST(req: Request) {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const payload = body as Record<string, unknown>;
  const message = typeof payload.message === "string" ? payload.message.trim() : "";
  const orderId = typeof payload.orderId === "string" ? payload.orderId.trim() : "";
  const phone = typeof payload.phone === "string" ? payload.phone.trim() : "";

  if (!message) {
    return NextResponse.json({ error: "문의 내용을 입력해 주세요." }, { status: 400 });
  }

  let normalizedOrderId: string | null = null;
  if (orderId) {
    if (!UUID_REGEX.test(orderId)) {
      return NextResponse.json({ error: "유효하지 않은 주문입니다." }, { status: 400 });
    }
    const order = await getConciergeOrderForUser({ id: orderId, userEmail: email });
    if (!order) {
      return NextResponse.json({ error: "유효하지 않은 주문입니다." }, { status: 400 });
    }
    normalizedOrderId = orderId;
  }

  const profile = await getUserProfileByEmail(email);
  const userName = profile?.userName ?? session?.user?.name ?? "고객";
  const phoneValue = phone || profile?.phone || null;

  const inquiry = await saveInquiry({
    orderId: normalizedOrderId,
    name: userName,
    email,
    phone: phoneValue,
    message,
    attachmentUrl: null,
  });

  return NextResponse.json({ inquiry });
}
