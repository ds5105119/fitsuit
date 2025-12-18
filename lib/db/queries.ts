import { sql } from "drizzle-orm";
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

export async function ensureInquiryTable() {
  await db.execute(sql`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "Inquiry" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "createdAt" timestamp NOT NULL DEFAULT now(),
      "name" varchar(120) NOT NULL,
      "email" varchar(160) NOT NULL,
      "phone" varchar(64),
      "message" text NOT NULL,
      "attachmentUrl" text
    )
  `);
}

export async function saveInquiry(data: NewInquiry) {
  await ensureInquiryTable();

  await db.insert(inquiry).values({
    name: data.name,
    email: data.email,
    phone: data.phone ?? null,
    message: data.message,
    attachmentUrl: data.attachmentUrl ?? null,
  });
}

export async function listInquiries() {
  await ensureInquiryTable();
  return db
    .select()
    .from(inquiry)
    .orderBy(sql`"createdAt" DESC`);
}

export async function ensureConciergeOrderTable() {
  await db.execute(sql`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "ConciergeOrder" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "createdAt" timestamp NOT NULL DEFAULT now(),
      "userEmail" varchar(160) NOT NULL,
      "userName" varchar(120),
      "status" varchar(32) NOT NULL DEFAULT '접수',
      "selections" jsonb NOT NULL,
      "measurements" jsonb,
      "previewUrl" text,
      "originalUpload" text,
      "backgroundPreview" text
    )
  `);
}

export async function saveConciergeOrder(data: NewConciergeOrder) {
  await ensureConciergeOrderTable();

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
  await ensureConciergeOrderTable();
  return db
    .select()
    .from(conciergeOrder)
    .where(sql`${conciergeOrder.userEmail} = ${userEmail}`)
    .orderBy(sql`"createdAt" DESC`);
}

export async function getConciergeOrderForUser({
  id,
  userEmail,
}: {
  id: string;
  userEmail: string;
}) {
  await ensureConciergeOrderTable();
  const [row] = await db
    .select()
    .from(conciergeOrder)
    .where(sql`${conciergeOrder.id} = ${id} AND ${conciergeOrder.userEmail} = ${userEmail}`)
    .limit(1);
  return row ?? null;
}

export async function listConciergeOrdersForAdmin() {
  await ensureConciergeOrderTable();
  return db.select().from(conciergeOrder).orderBy(sql`"createdAt" DESC`);
}

export async function getConciergeOrderById(id: string) {
  await ensureConciergeOrderTable();
  const [row] = await db
    .select()
    .from(conciergeOrder)
    .where(sql`${conciergeOrder.id} = ${id}`)
    .limit(1);
  return row ?? null;
}
