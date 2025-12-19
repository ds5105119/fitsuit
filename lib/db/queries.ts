import { and, eq, sql } from "drizzle-orm";
import { db } from "./client";
import { conciergeOrder, inquiry } from "./schema";

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
  const [row] = await db
    .insert(conciergeOrder)
    .values({
      userEmail: data.userEmail,
      userName: data.userName ?? null,
      status: data.status ?? "접수",
      selections: data.selections,
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
