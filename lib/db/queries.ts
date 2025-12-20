import { and, eq, sql } from "drizzle-orm";
import { db } from "./client";
import { conciergeOrder, inquiry } from "./schema";
import { StoredSelections, WearCategory } from "@/components/ai-configurator/types";

export const ORDER_STATUSES = ["접수", "취소", "제작중", "견적 완료", "완료"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type NewInquiry = {
  name: string;
  email: string;
  phone?: string | null;
  message: string;
  attachmentUrl?: string | null;
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
  await db.insert(inquiry).values({
    name: data.name,
    email: data.email,
    phone: data.phone ?? null,
    message: data.message,
    attachmentUrl: data.attachmentUrl ?? null,
  });
}

export async function listInquiries() {
  return db
    .select()
    .from(inquiry)
    .orderBy(sql`"createdAt" DESC`);
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
