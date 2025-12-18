import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/admin";
import { listConciergeOrdersForAdmin } from "@/lib/db/queries";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await listConciergeOrdersForAdmin();
  return NextResponse.json({ orders });
}

