import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { randomUUID } from "crypto";
import { auth } from "@/auth";
import { listConciergeOrdersForUser, saveConciergeOrder } from "@/lib/db/queries";

const MAX_IMAGE_STRING_LENGTH = 8_000_000;
const MAX_IMAGE_BYTES = 8_000_000;
const DATA_URL_REGEX = /^data:([^;]+);base64,(.+)$/;

const MIME_EXTENSION_MAP: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};

function parseDataUrl(input: string) {
  const match = input.match(DATA_URL_REGEX);
  if (!match) return null;
  return { mimeType: match[1], data: match[2] };
}

function isValidDataUrlOrUrl(input: unknown) {
  if (typeof input !== "string") return false;
  const trimmed = input.trim();
  if (!trimmed) return false;
  if (parseDataUrl(trimmed)) return true;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return true;
  if (trimmed.startsWith("/")) return true;
  return false;
}

function toSafePathSegment(input: string) {
  return input.replace(/[^a-z0-9@._-]/gi, "_");
}

async function persistImageField({
  value,
  field,
  userEmail,
}: {
  value: unknown;
  field: "previewUrl" | "originalUpload" | "backgroundPreview";
  userEmail: string;
}) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  const parsed = parseDataUrl(trimmed);
  if (!parsed) return trimmed;

  const buffer = Buffer.from(parsed.data, "base64");
  if (!buffer.length || buffer.byteLength > MAX_IMAGE_BYTES) {
    throw new Error("이미지 데이터가 올바르지 않거나 너무 큽니다.");
  }

  const extension = MIME_EXTENSION_MAP[parsed.mimeType] ?? "bin";
  const safeEmail = toSafePathSegment(userEmail);
  const filename = `${field}-${Date.now()}-${randomUUID()}.${extension}`;
  const blob = await put(`orders/${safeEmail}/${filename}`, buffer, {
    access: "public",
    contentType: parsed.mimeType,
  });

  return blob.url;
}

export async function GET() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await listConciergeOrdersForUser(email);
  return NextResponse.json({ orders });
}

export async function POST(req: Request) {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const selections = Array.isArray(body?.selections) ? body.selections : null;
  const measurements =
    body?.measurements && typeof body.measurements === "object" ? body.measurements : null;
  const previewUrl = body?.previewUrl;
  const originalUpload = body?.originalUpload;
  const backgroundPreview = body?.backgroundPreview;

  if (!selections || selections.length === 0) {
    return NextResponse.json({ error: "주문 구성이 비어있습니다." }, { status: 400 });
  }

  if (selections.length > 300) {
    return NextResponse.json({ error: "주문 구성이 너무 큽니다." }, { status: 400 });
  }

  const imageFields = [previewUrl, originalUpload, backgroundPreview].filter(
    (v) => v != null
  );
  if (
    imageFields.some(
      (v) =>
        typeof v !== "string" ||
        v.trim().length > MAX_IMAGE_STRING_LENGTH ||
        !isValidDataUrlOrUrl(v)
    )
  ) {
    return NextResponse.json(
      { error: "이미지 데이터가 올바르지 않습니다." },
      { status: 400 }
    );
  }

  const hasDataUrl = imageFields.some(
    (value) => typeof value === "string" && Boolean(parseDataUrl(value.trim()))
  );

  if (hasDataUrl && !process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "BLOB_READ_WRITE_TOKEN이 설정되지 않았습니다." },
      { status: 500 }
    );
  }

  let storedPreviewUrl: string | null = null;
  let storedOriginalUpload: string | null = null;
  let storedBackgroundPreview: string | null = null;

  try {
    storedPreviewUrl = await persistImageField({
      value: previewUrl,
      field: "previewUrl",
      userEmail: email,
    });
    storedOriginalUpload = await persistImageField({
      value: originalUpload,
      field: "originalUpload",
      userEmail: email,
    });
    storedBackgroundPreview = await persistImageField({
      value: backgroundPreview,
      field: "backgroundPreview",
      userEmail: email,
    });
  } catch (error) {
    console.error("blob upload error", error);
    return NextResponse.json(
      { error: "이미지 업로드 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }

  const inserted = await saveConciergeOrder({
    userEmail: email,
    userName: session?.user?.name ?? null,
    selections,
    measurements,
    previewUrl: storedPreviewUrl,
    originalUpload: storedOriginalUpload,
    backgroundPreview: storedBackgroundPreview,
  });

  return NextResponse.json({ order: inserted }, { status: 201 });
}
