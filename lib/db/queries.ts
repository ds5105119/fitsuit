import { and, desc, eq, gte, ilike, isNotNull, isNull, lte, notInArray, or, sql } from "drizzle-orm";
import { db } from "./client";
import { conciergeOrder, inquiry, userProfile } from "./schema";
import { StoredSelections, WearCategory } from "@/components/ai-configurator/types";
import { DEFAULT_INQUIRY_CATEGORY, type InquiryCategory } from "@/lib/inquiry";

export const ORDER_STATUSES = ["접수", "취소", "제작중", "견적 완료", "완료"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type NewInquiry = {
  orderId?: string | null;
  name: string;
  email: string;
  phone?: string | null;
  category?: InquiryCategory | null;
  message: string;
  attachmentUrl?: string | null;
  attachmentUrls?: string[] | null;
};

export type ConciergeSelectionItem = {
  category: string;
  group?: string | null;
  title: string;
  subtitle?: string | null;
};

export type ConciergeMeasurements = Record<string, string>;

export type NewConciergeOrder = {
  userEmail: string;
  userName?: string | null;
  price?: number | null;
  selections: ConciergeSelectionItem[];
  measurements?: ConciergeMeasurements | null;
  previewUrl?: string | null;
  originalUpload?: string | null;
  backgroundPreview?: string | null;
  status?: string | null;
};

export async function saveInquiry(data: NewInquiry) {
  const normalizedUrls = Array.isArray(data.attachmentUrls)
    ? data.attachmentUrls.map((url) => url.trim()).filter(Boolean)
    : [];
  const primaryUrl = normalizedUrls[0] ?? data.attachmentUrl ?? null;

  const [row] = await db.insert(inquiry).values({
    orderId: data.orderId ?? null,
    name: data.name,
    email: data.email,
    phone: data.phone ?? null,
    category: data.category ?? DEFAULT_INQUIRY_CATEGORY,
    message: data.message,
    attachmentUrl: primaryUrl,
    attachmentUrls: normalizedUrls.length ? normalizedUrls : primaryUrl ? [primaryUrl] : null,
  }).returning();
  return row ?? null;
}

export async function listInquiries() {
  return db
    .select()
    .from(inquiry)
    .orderBy(sql`"createdAt" DESC`);
}

export async function listInquiriesForUser(email: string) {
  return db
    .select()
    .from(inquiry)
    .where(eq(inquiry.email, email))
    .orderBy(sql`"createdAt" DESC`);
}

export async function getInquiryById(id: string) {
  const [row] = await db
    .select()
    .from(inquiry)
    .where(eq(inquiry.id, id))
    .limit(1);
  return row ?? null;
}

export async function updateInquiryReply({
  id,
  replyMessage,
}: {
  id: string;
  replyMessage: string | null;
}) {
  const [row] = await db
    .update(inquiry)
    .set({
      replyMessage,
      replyUpdatedAt: replyMessage ? new Date() : null,
    })
    .where(eq(inquiry.id, id))
    .returning();
  return row ?? null;
}

export async function deleteInquiryByIdForUser({
  id,
  email,
}: {
  id: string;
  email: string;
}) {
  const [row] = await db
    .delete(inquiry)
    .where(and(eq(inquiry.id, id), eq(inquiry.email, email)))
    .returning({
      id: inquiry.id,
      attachmentUrl: inquiry.attachmentUrl,
      attachmentUrls: inquiry.attachmentUrls,
    });
  return row ?? null;
}

type AdminInquiryFilters = {
  q?: string;
  start?: Date;
  end?: Date;
  reply?: "pending" | "answered";
  orderId?: string;
};

type AdminOrderFilters = {
  q?: string;
  start?: Date;
  end?: Date;
  status?: OrderStatus;
};

function buildInquiryWhere(filters?: AdminInquiryFilters) {
  if (!filters) return undefined;
  const conditions = [];

  if (filters.start) {
    conditions.push(gte(inquiry.createdAt, filters.start));
  }
  if (filters.end) {
    conditions.push(lte(inquiry.createdAt, filters.end));
  }
  if (filters.orderId) {
    conditions.push(eq(inquiry.orderId, filters.orderId));
  }
  if (filters.reply === "pending") {
    conditions.push(isNull(inquiry.replyMessage));
  }
  if (filters.reply === "answered") {
    conditions.push(isNotNull(inquiry.replyMessage));
  }
  if (filters.q) {
    const like = `%${filters.q}%`;
    conditions.push(
      or(
        ilike(inquiry.name, like),
        ilike(inquiry.email, like),
        ilike(inquiry.phone, like),
        ilike(inquiry.category, like),
        ilike(inquiry.message, like),
        ilike(sql<string>`${inquiry.orderId}::text`, like)
      )
    );
  }

  return conditions.length ? and(...conditions) : undefined;
}

function buildOrderWhere(filters?: AdminOrderFilters) {
  if (!filters) return undefined;
  const conditions = [];

  if (filters.start) {
    conditions.push(gte(conciergeOrder.createdAt, filters.start));
  }
  if (filters.end) {
    conditions.push(lte(conciergeOrder.createdAt, filters.end));
  }
  if (filters.status) {
    conditions.push(eq(conciergeOrder.status, filters.status));
  }
  if (filters.q) {
    const like = `%${filters.q}%`;
    conditions.push(
      or(
        ilike(sql<string>`${conciergeOrder.id}::text`, like),
        ilike(conciergeOrder.userEmail, like),
        ilike(conciergeOrder.userName, like),
        ilike(conciergeOrder.status, like)
      )
    );
  }

  return conditions.length ? and(...conditions) : undefined;
}

export async function listInquiriesForAdminPage({
  page,
  pageSize,
  filters,
}: {
  page: number;
  pageSize: number;
  filters?: AdminInquiryFilters;
}) {
  const whereClause = buildInquiryWhere(filters);
  const totalQuery = db.select({ count: sql<number>`count(*)` }).from(inquiry);
  const pendingQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(inquiry)
    .where(isNull(inquiry.replyMessage));
  const filteredCountQuery = whereClause
    ? db.select({ count: sql<number>`count(*)` }).from(inquiry).where(whereClause)
    : db.select({ count: sql<number>`count(*)` }).from(inquiry);

  const [totalRows, pendingRows, filteredRows] = await Promise.all([
    totalQuery,
    pendingQuery,
    filteredCountQuery,
  ]);

  const total = Number(totalRows[0]?.count ?? 0);
  const pendingCount = Number(pendingRows[0]?.count ?? 0);
  const filteredTotal = Number(filteredRows[0]?.count ?? 0);
  const totalPages = Math.max(1, Math.ceil(filteredTotal / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const offset = (safePage - 1) * pageSize;

  const dataQuery = whereClause
    ? db.select().from(inquiry).where(whereClause)
    : db.select().from(inquiry);
  const inquiries = await dataQuery
    .orderBy(desc(inquiry.createdAt))
    .limit(pageSize)
    .offset(offset);

  return {
    inquiries,
    total,
    filteredTotal,
    pendingCount,
    page: safePage,
  };
}

export async function saveConciergeOrder(data: NewConciergeOrder) {
  const selections: StoredSelections = data.selections.map((s) => ({
    category: s.category as WearCategory,
    group: s.group ?? null,
    title: s.title,
    subtitle: s.subtitle ?? "",
  }));

  const [row] = await db
    .insert(conciergeOrder)
    .values({
      userEmail: data.userEmail,
      userName: data.userName ?? null,
      status: data.status ?? "접수",
      price: data.price ?? null,
      selections,
      measurements: data.measurements ?? null,
      previewUrl: data.previewUrl ?? null,
      originalUpload: data.originalUpload ?? null,
      backgroundPreview: data.backgroundPreview ?? null,
    })
    .returning({
      id: conciergeOrder.id,
      createdAt: conciergeOrder.createdAt,
    });

  return row;
}

export async function listConciergeOrdersForUser(userEmail: string) {
  return db
    .select()
    .from(conciergeOrder)
    .where(eq(conciergeOrder.userEmail, userEmail))
    .orderBy(sql`"createdAt" DESC`);
}

export async function getConciergeOrderForUser({
  id,
  userEmail,
}: {
  id: string;
  userEmail: string;
}) {
  const [row] = await db
    .select()
    .from(conciergeOrder)
    .where(and(eq(conciergeOrder.id, id), eq(conciergeOrder.userEmail, userEmail)))
    .limit(1);
  return row ?? null;
}

export async function listConciergeOrdersForAdmin() {
  return db.select().from(conciergeOrder).orderBy(sql`"createdAt" DESC`);
}

export async function listConciergeOrdersForAdminPage({
  page,
  pageSize,
  filters,
}: {
  page: number;
  pageSize: number;
  filters?: AdminOrderFilters;
}) {
  const whereClause = buildOrderWhere(filters);
  const totalQuery = db.select({ count: sql<number>`count(*)` }).from(conciergeOrder);
  const inProgressQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(conciergeOrder)
    .where(notInArray(conciergeOrder.status, ["완료", "취소"]));
  const filteredCountQuery = whereClause
    ? db.select({ count: sql<number>`count(*)` }).from(conciergeOrder).where(whereClause)
    : db.select({ count: sql<number>`count(*)` }).from(conciergeOrder);

  const [totalRows, inProgressRows, filteredRows] = await Promise.all([
    totalQuery,
    inProgressQuery,
    filteredCountQuery,
  ]);

  const total = Number(totalRows[0]?.count ?? 0);
  const inProgressCount = Number(inProgressRows[0]?.count ?? 0);
  const filteredTotal = Number(filteredRows[0]?.count ?? 0);
  const totalPages = Math.max(1, Math.ceil(filteredTotal / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const offset = (safePage - 1) * pageSize;

  const dataQuery = whereClause
    ? db.select().from(conciergeOrder).where(whereClause)
    : db.select().from(conciergeOrder);
  const orders = await dataQuery
    .orderBy(desc(conciergeOrder.createdAt))
    .limit(pageSize)
    .offset(offset);

  return {
    orders,
    total,
    filteredTotal,
    inProgressCount,
    page: safePage,
  };
}

export async function getConciergeOrderById(id: string) {
  const [row] = await db
    .select()
    .from(conciergeOrder)
    .where(eq(conciergeOrder.id, id))
    .limit(1);
  return row ?? null;
}

export async function deleteConciergeOrderById(id: string) {
  const [row] = await db
    .delete(conciergeOrder)
    .where(eq(conciergeOrder.id, id))
    .returning({
      id: conciergeOrder.id,
      previewUrl: conciergeOrder.previewUrl,
      originalUpload: conciergeOrder.originalUpload,
      backgroundPreview: conciergeOrder.backgroundPreview,
    });

  return row ?? null;
}

export async function getUserProfileByEmail(userEmail: string) {
  const [row] = await db
    .select()
    .from(userProfile)
    .where(eq(userProfile.userEmail, userEmail))
    .limit(1);
  return row ?? null;
}

export async function upsertUserProfile({
  userEmail,
  userName,
  phone,
  address,
  gender,
  birthDate,
}: {
  userEmail: string;
  userName: string | null;
  phone: string | null;
  address: string | null;
  gender: string | null;
  birthDate: string | null;
}) {
  const now = new Date();
  const [row] = await db
    .insert(userProfile)
    .values({
      userEmail,
      userName,
      phone,
      address,
      gender,
      birthDate,
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: userProfile.userEmail,
      set: {
        userName,
        phone,
        address,
        gender,
        birthDate,
        updatedAt: now,
      },
    })
    .returning();
  return row ?? null;
}

export async function deleteUserProfileByEmail(userEmail: string) {
  const [row] = await db
    .delete(userProfile)
    .where(eq(userProfile.userEmail, userEmail))
    .returning();
  return row ?? null;
}

export async function deleteConciergeOrdersByUserEmail(userEmail: string) {
  return db
    .delete(conciergeOrder)
    .where(eq(conciergeOrder.userEmail, userEmail))
    .returning({
      previewUrl: conciergeOrder.previewUrl,
      originalUpload: conciergeOrder.originalUpload,
      backgroundPreview: conciergeOrder.backgroundPreview,
    });
}

export async function updateConciergeOrderStatus({
  id,
  status,
  userEmail,
}: {
  id: string;
  status: OrderStatus;
  userEmail?: string;
}) {
  const where =
    typeof userEmail === "string"
      ? and(eq(conciergeOrder.id, id), eq(conciergeOrder.userEmail, userEmail))
      : eq(conciergeOrder.id, id);

  const [row] = await db
    .update(conciergeOrder)
    .set({ status })
    .where(where)
    .returning();

  return row ?? null;
}

export async function updateConciergeOrderById({
  id,
  status,
  price,
}: {
  id: string;
  status?: OrderStatus;
  price?: number | null;
}) {
  const updates: Partial<typeof conciergeOrder.$inferInsert> = {};
  if (typeof status === "string") {
    updates.status = status;
  }
  if (price !== undefined) {
    updates.price = price;
  }
  if (Object.keys(updates).length === 0) {
    return null;
  }

  const [row] = await db
    .update(conciergeOrder)
    .set(updates)
    .where(eq(conciergeOrder.id, id))
    .returning();

  return row ?? null;
}
