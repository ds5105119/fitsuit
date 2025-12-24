import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { saveInquiry } from "@/lib/db/queries";
import { DEFAULT_INQUIRY_CATEGORY, normalizeInquiryCategory } from "@/lib/inquiry";

const UUID_REGEX = /^[0-9a-fA-F-]{36}$/;
const MAX_ATTACHMENT_BYTES = 8_000_000;
const MAX_ATTACHMENTS = 10;

function toSafeFilename(filename: string) {
  return filename.replace(/[^a-z0-9._-]/gi, "_");
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const orderId = String(formData.get("orderId") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const rawCategory = String(formData.get("category") || "").trim();
  const message = String(formData.get("message") || "").trim();
  const rawAttachments = formData.getAll("attachments");
  const legacyAttachment = formData.get("attachment");
  const attachments = rawAttachments.length > 0 ? rawAttachments : legacyAttachment ? [legacyAttachment] : [];
  const files = attachments.filter((value): value is File => value instanceof File && value.size > 0);

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "필수 정보를 모두 입력해주세요." },
      { status: 400 }
    );
  }

  let category = DEFAULT_INQUIRY_CATEGORY;
  if (rawCategory) {
    const normalized = normalizeInquiryCategory(rawCategory);
    if (!normalized) {
      return NextResponse.json({ error: "문의 종류를 선택해주세요." }, { status: 400 });
    }
    category = normalized;
  }

  let attachmentUrl: string | null = null;
  const attachmentUrls: string[] = [];

  if (files.length > MAX_ATTACHMENTS) {
    return NextResponse.json(
      { error: "첨부 파일은 최대 10장까지 업로드할 수 있습니다." },
      { status: 400 }
    );
  }

  for (const file of files) {
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "이미지 파일만 업로드할 수 있습니다." }, { status: 400 });
    }
    if (file.size > MAX_ATTACHMENT_BYTES) {
      return NextResponse.json({ error: "첨부 파일은 8MB 이하여야 합니다." }, { status: 400 });
    }
  }

  if (files.length > 0) {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        { error: "BLOB_READ_WRITE_TOKEN이 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    const uploads = files.map(async (file, index) => {
      const safeName = toSafeFilename(file.name || `attachment-${index + 1}`);
      const blob = await put(
        `inquiries/${Date.now()}-${index + 1}-${safeName}`,
        file,
        {
          access: "public",
          contentType: file.type || "application/octet-stream",
        }
      );
      return blob.url;
    });

    const results = await Promise.all(uploads);
    attachmentUrls.push(...results);
    attachmentUrl = attachmentUrls[0] ?? null;
  }

  const normalizedOrderId = orderId && UUID_REGEX.test(orderId) ? orderId : null;

  await saveInquiry({
    orderId: normalizedOrderId,
    name,
    email,
    phone: phone || null,
    category,
    message,
    attachmentUrl,
    attachmentUrls,
  });

  return NextResponse.json({ ok: true });
}
