import Link from "next/link";
import { AdminLoginGate } from "@/components/admin/admin-login-gate";

export const metadata = {
  title: "Admin Login",
};

export default async function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-neutral-50 w-full px-6 py-16 text-black">
      <div className="mx-auto flex max-w-md flex-col gap-6 rounded-2xl border border-white/10 bg-white/5 p-8">
        <Link href="/" className="text-xs uppercase tracking-[0.22em] text-black">
          ← Home
        </Link>
        <div>
          <h1 className="text-3xl font-semibold text-black">로그인</h1>
        </div>
        <AdminLoginGate />
      </div>
    </main>
  );
}
