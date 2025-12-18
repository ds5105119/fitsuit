import { NextResponse } from "next/server";
import { getUserSession } from "@/lib/auth/user-session";
import { listConciergeOrdersForUser, saveConciergeOrder } from "@/lib/db/queries";

function isValidDataUrlOrUrl(input: unknown) {
  if (typeof input !== "string") return false;
  if (input.startsWith("data:")) return true;
  if (input.startsWith("http://") || input.startsWith("https://")) return true;
  if (input.startsWith("/")) return true;
  return false;
}

export async function GET() {
  const session = await getUserSession();
  const email = session?.user?.email;
  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await listConciergeOrdersForUser(email);
  return NextResponse.json({ orders });
}

export async function POST(req: Request) {
  const session = await getUserSession();
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
      (v) => typeof v !== "string" || v.length > 8_000_000 || !isValidDataUrlOrUrl(v)
    )
  ) {
    return NextResponse.json(
      { error: "이미지 데이터가 올바르지 않습니다." },
      { status: 400 }
    );
  }

  const inserted = await saveConciergeOrder({
    userEmail: email,
    userName: session?.user?.name ?? null,
    selections,
    measurements,
    previewUrl: previewUrl ?? null,
    originalUpload: originalUpload ?? null,
    backgroundPreview: backgroundPreview ?? null,
  });

  return NextResponse.json({ order: inserted }, { status: 201 });
}

