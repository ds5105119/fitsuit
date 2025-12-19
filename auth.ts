import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set`);
  return value;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  trustHost: process.env.AUTH_TRUST_HOST === "true" || process.env.NODE_ENV !== "production",
  providers: [
    Google({
      clientId: requireEnv("AUTH_GOOGLE_ID"),
      clientSecret: requireEnv("AUTH_GOOGLE_SECRET"),
    }),
  ],
  pages: {
    signIn: "/mypage/login",
  },
  session: {
    strategy: "jwt",
  },
});
