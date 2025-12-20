import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { saveInquiry } from "@/lib/db/queries";

const UUID_REGEX = /^[0-9a-fA-F-]{36}$/;

export async function POST(request: Request) {
  const formData = await request.formData();
  const orderId = String(formData.get("orderId") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const message = String(formData.get("message") || "").trim();
  const attachment = formData.get("attachment");

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "필수 정보를 모두 입력해주세요." },
      { status: 400 }
    );
  }

  let attachmentUrl: string | null = null;

  if (attachment instanceof File && attachment.size > 0) {
    const blob = await put(
      `inquiries/${Date.now()}-${attachment.name}`,
      attachment,
      {
        access: "public",
      }
    );
    attachmentUrl = blob.url;
  }

  const normalizedOrderId = orderId && UUID_REGEX.test(orderId) ? orderId : null;

  await saveInquiry({
    orderId: normalizedOrderId,
    name,
    email,
    phone: phone || null,
    message,
    attachmentUrl,
  });

  return NextResponse.json({ ok: true });
}
