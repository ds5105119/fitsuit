import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/admin";
import { getInquiryById, updateInquiryReply } from "@/lib/db/queries";

const UUID_REGEX = /^[0-9a-fA-F-]{36}$/;

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!id || !UUID_REGEX.test(id)) {
    return NextResponse.json({ error: "잘못된 문의입니다." }, { status: 400 });
  }
  const inquiry = await getInquiryById(id);
  if (!inquiry) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ inquiry });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const payload = body as Record<string, unknown>;
  const rawReply = typeof payload.replyMessage === "string" ? payload.replyMessage.trim() : "";
  const nextReply = rawReply ? rawReply : null;

  const { id } = await params;
  if (!id || !UUID_REGEX.test(id)) {
    return NextResponse.json({ error: "잘못된 문의입니다." }, { status: 400 });
  }
  const updated = await updateInquiryReply({ id, replyMessage: nextReply });
  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ inquiry: updated });
}
