import { integer, jsonb, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import type { InferSelectModel } from "drizzle-orm";
import { Measurements, StoredSelections } from "@/components/ai-configurator/types";

export const inquiry = pgTable("Inquiry", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  orderId: uuid("orderId"),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 160 }).notNull(),
  phone: varchar("phone", { length: 64 }),
  category: varchar("category", { length: 32 }).notNull().default("기타"),
  message: text("message").notNull(),
  attachmentUrls: jsonb("attachmentUrls").$type<string[]>(),
  attachmentUrl: text("attachmentUrl"),
  replyMessage: text("replyMessage"),
  replyUpdatedAt: timestamp("replyUpdatedAt"),
});

export type Inquiry = InferSelectModel<typeof inquiry>;

export const adminUser = pgTable("AdminUser", {
  username: varchar("username", { length: 64 }).primaryKey().notNull(),
  passwordHash: text("passwordHash").notNull(),
  salt: text("salt").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export type AdminUser = InferSelectModel<typeof adminUser>;

export const userCredential = pgTable("UserCredential", {
  userEmail: varchar("userEmail", { length: 160 }).primaryKey().notNull(),
  passwordHash: text("passwordHash").notNull(),
  salt: text("salt").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export type UserCredential = InferSelectModel<typeof userCredential>;

export const userProfile = pgTable("UserProfile", {
  userEmail: varchar("userEmail", { length: 160 })
    .primaryKey()
    .notNull()
    .references(() => userCredential.userEmail, { onDelete: "cascade" }),
  userName: varchar("userName", { length: 120 }),
  phone: varchar("phone", { length: 64 }),
  address: text("address"),
  gender: varchar("gender", { length: 32 }),
  birthDate: varchar("birthDate", { length: 16 }),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export type UserProfile = InferSelectModel<typeof userProfile>;

export const conciergeOrder = pgTable("ConciergeOrder", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  userEmail: varchar("userEmail", { length: 160 }).notNull(),
  userName: varchar("userName", { length: 120 }),
  status: varchar("status", { length: 32 }).notNull().default("접수"),
  price: integer("price"),
  selections: jsonb("selections").$type<StoredSelections>().notNull(),
  measurements: jsonb("measurements").$type<Measurements>(),
  previewUrl: text("previewUrl"),
  originalUpload: text("originalUpload"),
  backgroundPreview: text("backgroundPreview"),
});

export type ConciergeOrder = InferSelectModel<typeof conciergeOrder>;
