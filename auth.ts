import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { verifyUserCredentials } from "@/lib/auth/user";

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set`);
  return value;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  trustHost: process.env.AUTH_TRUST_HOST === "true" || process.env.NODE_ENV !== "production",
  providers: [
    Credentials({
      credentials: {
        email: {
          type: "text",
          label: "Email",
          placeholder: "you@example.com",
        },
        password: {
          type: "password",
          label: "Password",
          placeholder: "********",
        },
      },
      authorize: async (credentials) => {
        const email = typeof credentials?.email === "string" ? credentials.email.trim() : "";
        const password = typeof credentials?.password === "string" ? credentials.password : "";
        if (!email || !password) return null;
        const user = await verifyUserCredentials(email, password);
        return user ?? null;
      },
    }),
    Google({
      clientId: requireEnv("AUTH_GOOGLE_ID"),
      clientSecret: requireEnv("AUTH_GOOGLE_SECRET"),
    }),
  ],
  session: {
    strategy: "jwt",
  },
});
