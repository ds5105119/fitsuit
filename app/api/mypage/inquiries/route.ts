import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { auth } from "@/auth";
import { getConciergeOrderForUser, getUserProfileByEmail, saveInquiry } from "@/lib/db/queries";
import { DEFAULT_INQUIRY_CATEGORY, normalizeInquiryCategory } from "@/lib/inquiry";

const UUID_REGEX = /^[0-9a-fA-F-]{36}$/;
const MAX_ATTACHMENT_BYTES = 8_000_000;
const MAX_ATTACHMENTS = 10;

function toSafePathSegment(value: string) {
  return value.replace(/[^a-z0-9@._-]/gi, "_");
}

function toSafeFilename(filename: string) {
  return filename.replace(/[^a-z0-9._-]/gi, "_");
}

export async function POST(req: Request) {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const contentType = req.headers.get("content-type") ?? "";
  let message = "";
  let orderId = "";
  let phone = "";
  let rawCategory = "";
  let attachments: File[] = [];

  if (contentType.includes("application/json")) {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
    }
    const payload = body as Record<string, unknown>;
    message = typeof payload.message === "string" ? payload.message.trim() : "";
    orderId = typeof payload.orderId === "string" ? payload.orderId.trim() : "";
    phone = typeof payload.phone === "string" ? payload.phone.trim() : "";
    rawCategory = typeof payload.category === "string" ? payload.category.trim() : "";
  } else {
    const formData = await req.formData();
    message = String(formData.get("message") || "").trim();
    orderId = String(formData.get("orderId") || "").trim();
    phone = String(formData.get("phone") || "").trim();
    rawCategory = String(formData.get("category") || "").trim();
    const rawAttachments = formData.getAll("attachments");
    const legacyAttachment = formData.get("attachment");
    const collected = rawAttachments.length > 0 ? rawAttachments : legacyAttachment ? [legacyAttachment] : [];
    attachments = collected.filter(
      (value): value is File => value instanceof File && value.size > 0
    );
  }

  if (!message) {
    return NextResponse.json({ error: "문의 내용을 입력해 주세요." }, { status: 400 });
  }

  let category = DEFAULT_INQUIRY_CATEGORY;
  if (rawCategory) {
    const normalized = normalizeInquiryCategory(rawCategory);
    if (!normalized) {
      return NextResponse.json({ error: "문의 종류를 선택해 주세요." }, { status: 400 });
    }
    category = normalized;
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

  const attachmentUrls: string[] = [];

  if (attachments.length > MAX_ATTACHMENTS) {
    return NextResponse.json(
      { error: "첨부 파일은 최대 10장까지 업로드할 수 있습니다." },
      { status: 400 }
    );
  }

  for (const file of attachments) {
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "이미지 파일만 업로드할 수 있습니다." }, { status: 400 });
    }
    if (file.size > MAX_ATTACHMENT_BYTES) {
      return NextResponse.json({ error: "첨부 파일은 8MB 이하여야 합니다." }, { status: 400 });
    }
  }

  if (attachments.length > 0) {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        { error: "BLOB_READ_WRITE_TOKEN이 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    const safeEmail = toSafePathSegment(email);
    const uploads = attachments.map(async (file, index) => {
      const safeName = toSafeFilename(file.name || `attachment-${index + 1}`);
      const blob = await put(
        `inquiries/${safeEmail}/${Date.now()}-${index + 1}-${safeName}`,
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
  }

  const inquiry = await saveInquiry({
    orderId: normalizedOrderId,
    name: userName,
    email,
    phone: phoneValue,
    category,
    message,
    attachmentUrl: attachmentUrls[0] ?? null,
    attachmentUrls,
  });

  return NextResponse.json({ inquiry });
}
