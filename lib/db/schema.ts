import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import type { InferSelectModel } from "drizzle-orm";

export const inquiry = pgTable("Inquiry", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 160 }).notNull(),
  phone: varchar("phone", { length: 64 }),
  message: text("message").notNull(),
  attachmentUrl: text("attachmentUrl"),
});

export type Inquiry = InferSelectModel<typeof inquiry>;

export const adminUser = pgTable("AdminUser", {
  username: varchar("username", { length: 64 }).primaryKey().notNull(),
  passwordHash: text("passwordHash").notNull(),
  salt: text("salt").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export type AdminUser = InferSelectModel<typeof adminUser>;
