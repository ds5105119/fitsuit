import crypto from "crypto";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { adminUser } from "@/lib/db/schema";
import { db } from "@/lib/db/client";

const SESSION_COOKIE = "admin_session";

type SessionPayload = {
  username: string;
  issuedAt: number;
};

function getSecret() {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SECRET is not set");
  }
  return secret;
}

function sign(payload: SessionPayload) {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const hmac = crypto
    .createHmac("sha256", getSecret())
    .update(data)
    .digest("base64url");
  return `${data}.${hmac}`;
}

function verify(token: string): SessionPayload | null {
  const [data, signature] = token.split(".");
  if (!data || !signature) return null;
  const expected = crypto
    .createHmac("sha256", getSecret())
    .update(data)
    .digest("base64url");
  if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) {
    return null;
  }
  try {
    const payload = JSON.parse(
      Buffer.from(data, "base64url").toString("utf8")
    ) as SessionPayload;
    return payload;
  } catch {
    return null;
  }
}

export function hashPassword(password: string, salt?: string) {
  const actualSalt = salt ?? crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, actualSalt, 64).toString("hex");
  return { hash, salt: actualSalt };
}

export async function verifyAdminCredentials(
  username: string,
  password: string
) {
  const [user] = await db
    .select()
    .from(adminUser)
    .where(eq(adminUser.username, username));

  if (!user) return false;

  const { hash } = hashPassword(password, user.salt);
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(user.passwordHash));
}

export async function getAdminUserByUsername(username: string) {
  const [user] = await db
    .select()
    .from(adminUser)
    .where(eq(adminUser.username, username));
  return user ?? null;
}

export async function listAdminUsers() {
  return db.select().from(adminUser).orderBy(adminUser.createdAt);
}

export async function createAdminUser({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  const { hash, salt } = hashPassword(password);
  const [row] = await db
    .insert(adminUser)
    .values({ username, passwordHash: hash, salt })
    .returning();
  return row ?? null;
}

export async function deleteAdminUser(username: string) {
  const [row] = await db
    .delete(adminUser)
    .where(eq(adminUser.username, username))
    .returning();
  return row ?? null;
}

export async function updateAdminCredentials({
  currentUsername,
  username,
  password,
}: {
  currentUsername: string;
  username: string;
  password: string;
}) {
  const { hash, salt } = hashPassword(password);
  const [row] = await db
    .update(adminUser)
    .set({ username, passwordHash: hash, salt })
    .where(eq(adminUser.username, currentUsername))
    .returning();
  return row ?? null;
}

export async function setAdminSession(username: string) {
  const cookieStore = await cookies();
  const token = sign({ username, issuedAt: Date.now() });
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verify(token);
}
