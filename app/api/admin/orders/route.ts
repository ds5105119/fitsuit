import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/admin";
import { listConciergeOrdersForAdminPage, ORDER_STATUSES, OrderStatus } from "@/lib/db/queries";

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 50;

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

  const rawStatus = searchParams.get("status");
  const status =
    rawStatus && ORDER_STATUSES.includes(rawStatus as OrderStatus) ? (rawStatus as OrderStatus) : undefined;
  const rawQuery = searchParams.get("q");
  const query = rawQuery ? rawQuery.trim() : "";
  const start = parseDate(searchParams.get("start"), false);
  const end = parseDate(searchParams.get("end"), true);

  const result = await listConciergeOrdersForAdminPage({
    page,
    pageSize,
    filters: {
      q: query || undefined,
      status,
      start,
      end,
    },
  });

  return NextResponse.json({
    orders: result.orders,
    total: result.total,
    filteredTotal: result.filteredTotal,
    inProgressCount: result.inProgressCount,
    page: result.page,
    pageSize,
  });
}
