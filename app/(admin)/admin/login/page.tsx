import Link from "next/link";
import { AdminLoginGate } from "@/components/admin/admin-login-gate";

export const metadata = {
  title: "Admin Login",
};

export default async function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black px-6 py-16 text-white">
      <div className="mx-auto flex max-w-md flex-col gap-6 rounded-2xl border border-white/10 bg-white/5 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
        <Link href="/" className="text-xs uppercase tracking-[0.22em] text-amber-200 hover:text-amber-100">
          ← Home
        </Link>
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-amber-200">Admin</p>
          <h1 className="text-3xl font-semibold text-white">로그인</h1>
          <p className="text-sm text-white/70">기본 계정 admin / admin 으로 로그인 후 비밀번호를 변경하세요.</p>
        </div>
        <AdminLoginGate />
      </div>
    </main>
  );
}
