import { NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { auth } from "@/auth";
import { deleteInquiryByIdForUser } from "@/lib/db/queries";

const UUID_REGEX = /^[0-9a-fA-F-]{36}$/;

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!id || !UUID_REGEX.test(id)) {
    return NextResponse.json({ error: "잘못된 문의입니다." }, { status: 400 });
  }

  const deleted = await deleteInquiryByIdForUser({ id, email });
  if (!deleted) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const urls = new Set<string>();
  if (deleted.attachmentUrl) {
    urls.add(deleted.attachmentUrl);
  }
  if (Array.isArray(deleted.attachmentUrls)) {
    deleted.attachmentUrls.forEach((url) => {
      if (typeof url === "string" && url.trim()) {
        urls.add(url);
      }
    });
  }

  const blobUrls = Array.from(urls);
  if (blobUrls.length > 0) {
    try {
      await del(blobUrls);
    } catch (error) {
      console.error("blob delete error", error);
    }
  }

  return NextResponse.json({ ok: true });
}
