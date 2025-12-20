import { AdminSettings } from "@/components/admin/admin-settings";

export const metadata = {
  title: "Admin | Settings",
};

export default function AdminSettingsPage() {
  return (
    <main className="min-h-screen w-full bg-neutral-50 px-4 py-6 text-neutral-900 md:px-10 md:py-8">
      <div className="mb-6">
        <p className="text-xs font-semibold tracking-[0.18em] text-neutral-500">SETTINGS</p>
        <h1 className="text-2xl font-bold text-neutral-900">관리자 설정</h1>
        <p className="text-sm text-neutral-500">아이디/비밀번호 변경 및 로그아웃.</p>
      </div>
      <AdminSettings />
    </main>
  );
}
