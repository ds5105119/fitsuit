import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getConciergeOrderForUser } from "@/lib/db/queries";

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
