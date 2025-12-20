import { NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { getAdminSession } from "@/lib/auth/admin";
import { deleteConciergeOrderById, getConciergeOrderById, ORDER_STATUSES, updateConciergeOrderStatus } from "@/lib/db/queries";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const order = await getConciergeOrderById(id);
  if (!order) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ order });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const status = body?.status;
  if (!ORDER_STATUSES.includes(status)) {
    return NextResponse.json({ error: "잘못된 상태입니다." }, { status: 400 });
  }

  const { id } = await params;
  const updated = await updateConciergeOrderStatus({ id, status });
  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ order: updated });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const deleted = await deleteConciergeOrderById(id);
  if (!deleted) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const blobUrls = [deleted.previewUrl, deleted.originalUpload, deleted.backgroundPreview].filter((value): value is string => typeof value === "string");

  try {
    await del(blobUrls);
  } catch (error) {
    console.error("blob delete error", error);
  }

  return NextResponse.json({ ok: true });
}
