import { NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { auth } from "@/auth";
import {
  deleteConciergeOrdersByUserEmail,
  deleteUserProfileByEmail,
  getUserProfileByEmail,
  upsertUserProfile,
} from "@/lib/db/queries";

const ALLOWED_GENDERS = new Set(["남성", "여성", "기타"]);

function normalizeField(value: unknown) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function normalizeGender(value: unknown) {
  const normalized = normalizeField(value);
  if (!normalized) return null;
  if (!ALLOWED_GENDERS.has(normalized)) {
    throw new Error("invalid_gender");
  }
  return normalized;
}

function normalizeBirthDate(value: unknown) {
  const normalized = normalizeField(value);
  if (!normalized) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    throw new Error("invalid_birth");
  }
  return normalized;
}

export async function GET() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await getUserProfileByEmail(email);
  return NextResponse.json({ profile });
}

export async function PATCH(req: Request) {
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

  let gender: string | null = null;
  let birthDate: string | null = null;

  try {
    gender = normalizeGender(payload.gender);
    birthDate = normalizeBirthDate(payload.birthDate);
  } catch (error) {
    return NextResponse.json({ error: "잘못된 값이 포함되어 있습니다." }, { status: 400 });
  }

  const profile = await upsertUserProfile({
    userEmail: email,
    userName: normalizeField(payload.userName),
    phone: normalizeField(payload.phone),
    address: normalizeField(payload.address),
    gender,
    birthDate,
  });

  return NextResponse.json({ profile });
}

export async function DELETE() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const deletedOrders = await deleteConciergeOrdersByUserEmail(email);
  await deleteUserProfileByEmail(email);

  const blobUrls = deletedOrders
    .flatMap((order) => [order.previewUrl, order.originalUpload, order.backgroundPreview])
    .filter((value): value is string => typeof value === "string");

  if (blobUrls.length > 0) {
    try {
      await del(blobUrls);
    } catch (error) {
      console.error("blob delete error", error);
    }
  }

  return NextResponse.json({ ok: true });
}
