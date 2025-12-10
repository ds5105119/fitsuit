import Link from "next/link";
import { AdminDashboard } from "@/components/admin-dashboard";
import { AdminSettings } from "@/components/admin-settings";

export const metadata = {
  title: "Admin | Inquiries",
};

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black px-6 py-16 text-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-amber-200">
              Admin
            </p>
            <h1 className="text-3xl font-semibold tracking-wide text-white">
              문의 내역
            </h1>
            <p className="text-sm text-white/70">
              로그인 후 문의 리스트를 확인하세요.
            </p>
          </div>
          <Link
            href="/"
            className="rounded-full border border-white/20 px-4 py-2 text-sm text-white hover:border-amber-200"
          >
            홈으로
          </Link>
        </div>

        <AdminSettings />
        <AdminDashboard />
      </div>
    </main>
  );
}
