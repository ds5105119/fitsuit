import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getConciergeOrderForUser, ORDER_STATUSES, updateConciergeOrderStatus } from "@/lib/db/queries";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const order = await getConciergeOrderForUser({ id, userEmail: email });
  if (!order) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ order });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const status = body?.status;
  if (status !== "취소") {
    return NextResponse.json({ error: "취소만 가능합니다." }, { status: 400 });
  }
  if (!ORDER_STATUSES.includes(status)) {
    return NextResponse.json({ error: "잘못된 상태입니다." }, { status: 400 });
  }

  const { id } = await params;
  const updated = await updateConciergeOrderStatus({ id, status, userEmail: email });
  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ order: updated });
}
