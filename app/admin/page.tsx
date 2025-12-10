import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth/admin";
import { listInquiries } from "@/lib/db/queries";
import { AdminSettings } from "@/components/admin-settings";

export const metadata = {
  title: "Admin | Inquiries",
};

export default async function AdminPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  const inquiries = await listInquiries();

  const formatter = new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  });

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
              총 {inquiries.length}건 • 최신순
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

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          <table className="min-w-full divide-y divide-white/10 text-sm">
            <thead className="bg-white/5 text-left uppercase tracking-[0.14em] text-white/70">
              <tr>
                <th className="px-4 py-3">날짜</th>
                <th className="px-4 py-3">이름</th>
                <th className="px-4 py-3">연락처</th>
                <th className="px-4 py-3">메시지</th>
                <th className="px-4 py-3">첨부</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {inquiries.map((inq) => (
                <tr key={inq.id} className="hover:bg-white/5">
                  <td className="px-4 py-3 text-white/70">
                    {formatter.format(new Date(inq.createdAt))}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-white">{inq.name}</div>
                    <div className="text-xs text-white/60">{inq.email}</div>
                  </td>
                  <td className="px-4 py-3 text-white/80">
                    {inq.phone || "-"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="line-clamp-3 text-white/80">
                      {inq.message}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {inq.attachmentUrl ? (
                      <a
                        href={inq.attachmentUrl}
                        className="text-amber-200 underline underline-offset-4"
                        target="_blank"
                        rel="noreferrer"
                      >
                        보기
                      </a>
                    ) : (
                      <span className="text-white/50">없음</span>
                    )}
                  </td>
                </tr>
              ))}
              {inquiries.length === 0 && (
                <tr>
                  <td
                    className="px-4 py-6 text-center text-white/60"
                    colSpan={5}
                  >
                    아직 접수된 문의가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
