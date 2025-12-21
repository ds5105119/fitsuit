import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/admin";
import { listInquiriesForAdminPage } from "@/lib/db/queries";

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 50;
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function parseDate(value: string | null, endOfDay: boolean) {
  if (!value) return undefined;
  const suffix = endOfDay ? "T23:59:59.999" : "T00:00:00";
  const parsed = new Date(`${value}${suffix}`);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

export async function GET(request: Request) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const rawPage = Number(searchParams.get("page") ?? "");
  const rawPageSize = Number(searchParams.get("pageSize") ?? "");
  const page = Number.isFinite(rawPage) ? Math.max(1, Math.floor(rawPage)) : 1;
  const pageSize = Number.isFinite(rawPageSize)
    ? clamp(Math.floor(rawPageSize), 1, MAX_PAGE_SIZE)
    : DEFAULT_PAGE_SIZE;

  const rawReply = searchParams.get("reply");
  const reply = rawReply === "pending" || rawReply === "answered" ? rawReply : undefined;
  const rawOrderId = searchParams.get("orderId");
  const orderId = rawOrderId && UUID_REGEX.test(rawOrderId) ? rawOrderId : undefined;
  const rawQuery = searchParams.get("q");
  const query = rawQuery ? rawQuery.trim() : "";
  const start = parseDate(searchParams.get("start"), false);
  const end = parseDate(searchParams.get("end"), true);

  const result = await listInquiriesForAdminPage({
    page,
    pageSize,
    filters: {
      q: query || undefined,
      reply,
      orderId,
      start,
      end,
    },
  });

  return NextResponse.json({
    inquiries: result.inquiries,
    total: result.total,
    filteredTotal: result.filteredTotal,
    pendingCount: result.pendingCount,
    page: result.page,
    pageSize,
  });
}
