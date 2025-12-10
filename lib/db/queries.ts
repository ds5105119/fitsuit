import { sql } from "drizzle-orm";
import { db } from "./client";
import { inquiry } from "./schema";

export type NewInquiry = {
  name: string;
  email: string;
  phone?: string | null;
  message: string;
  attachmentUrl?: string | null;
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
