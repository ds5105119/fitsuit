import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { userCredential, userProfile } from "@/lib/db/schema";

/* ---------------- utils ---------------- */

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function normalizePassword(value: string) {
  return value.normalize("NFC");
}

const encoder = new TextEncoder();

/* timing-safe 비교 (Edge-safe) */
function timingSafeEqualHex(a: string, b: string) {
  if (a.length !== b.length) return false;

  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

/* ---------------- password hashing ---------------- */

export async function hashPassword(password: string, saltHex?: string) {
  const passwordBytes = encoder.encode(normalizePassword(password));

  const salt = saltHex ? Uint8Array.from(Buffer.from(saltHex, "hex")) : crypto.getRandomValues(new Uint8Array(16));

  const key = await crypto.subtle.importKey("raw", passwordBytes, "PBKDF2", false, ["deriveBits"]);

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: 310_000,
      hash: "SHA-256",
    },
    key,
    256
  );

  return {
    hash: Buffer.from(derivedBits).toString("hex"),
    salt: Buffer.from(salt).toString("hex"),
  };
}

/* ---------------- queries ---------------- */

export async function getUserCredentialByEmail(email: string) {
  const normalizedEmail = normalizeEmail(email);

  const [row] = await db
    .select({
      userEmail: userCredential.userEmail,
    })
    .from(userCredential)
    .where(eq(userCredential.userEmail, normalizedEmail))
    .limit(1);

  return row ?? null;
}

/* ---------------- create user ---------------- */

export async function createUserWithCredentials({ email, password, userName }: { email: string; password: string; userName?: string | null }) {
  const normalizedEmail = normalizeEmail(email);
  const trimmedName = userName?.trim() ?? "";

  const { hash, salt } = await hashPassword(password);

  console.log(hash, salt, password);

  return db.transaction(async (tx) => {
    const [credential] = await tx
      .insert(userCredential)
      .values({
        userEmail: normalizedEmail,
        passwordHash: hash,
        salt,
      })
      .returning({ userEmail: userCredential.userEmail });

    const [profile] = await tx
      .insert(userProfile)
      .values({
        userEmail: normalizedEmail,
        userName: trimmedName || null,
      })
      .returning({ userName: userProfile.userName });

    return {
      email: credential.userEmail,
      name: profile?.userName ?? null,
    };
  });
}

/* ---------------- verify credentials ---------------- */

export async function verifyUserCredentials(email: string, password: string) {
  const normalizedEmail = normalizeEmail(email);

  const [row] = await db
    .select({
      passwordHash: userCredential.passwordHash,
      salt: userCredential.salt,
      userName: userProfile.userName,
    })
    .from(userCredential)
    .leftJoin(userProfile, eq(userProfile.userEmail, userCredential.userEmail))
    .where(eq(userCredential.userEmail, normalizedEmail))
    .limit(1);

  if (!row) return null;

  const { hash } = await hashPassword(password, row.salt);
  console.log(hash, row.passwordHash);

  const matches = timingSafeEqualHex(hash, row.passwordHash);
  if (!matches) return null;

  return {
    id: normalizedEmail,
    email: normalizedEmail,
    name: row.userName ?? normalizedEmail,
  };
}
