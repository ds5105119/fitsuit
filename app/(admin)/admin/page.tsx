import Link from "next/link";

export const metadata = {
  title: "Admin | Overview",
};

export default function AdminHome() {
  const links = [
    { href: "/admin/orders", title: "주문 관리", desc: "컨시어지 주문 목록 및 상세 보기" },
    { href: "/admin/inquiries", title: "문의 관리", desc: "고객 문의 확인 및 응답" },
    { href: "/admin/settings", title: "관리자 설정", desc: "계정 변경 및 로그아웃" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50 text-neutral-900">
      <header className="border-b border-neutral-200 bg-white/90 px-4 py-4 backdrop-blur md:px-8">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold tracking-[0.18em] text-neutral-500">ADMIN OVERVIEW</p>
          <h1 className="text-2xl font-bold">관리 콘솔</h1>
          <p className="text-sm text-neutral-500">주문, 문의, 설정으로 바로 이동하세요.</p>
        </div>
      </header>
      <main className="flex-1 px-4 py-6 md:px-10 md:py-8">
        <div className="grid gap-4 md:grid-cols-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-2xl border border-neutral-200 bg-white px-4 py-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="text-sm font-semibold text-neutral-900">{link.title}</div>
              <p className="mt-1 text-sm text-neutral-500">{link.desc}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
