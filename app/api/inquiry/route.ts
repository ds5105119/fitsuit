import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { saveInquiry } from "@/lib/db/queries";

export async function POST(request: Request) {
  const formData = await request.formData();
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
        access: "private",
      }
    );
    attachmentUrl = blob.url;
  }

  await saveInquiry({
    name,
    email,
    phone: phone || null,
    message,
    attachmentUrl,
  });

  return NextResponse.json({ ok: true });
}
