export function MyPageSkeleton() {
  return (
    <main className="mt-16 lg:mt-20 min-h-[calc(100vh-4rem)] bg-neutral-50 text-neutral-900">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="border-b border-neutral-200 pb-4">
          <p className="text-xs tracking-[0.24em] text-neutral-500">MY</p>
          <h1 className="text-2xl font-bold">마이페이지</h1>
          <p className="mt-1 text-sm text-neutral-600">불러오는 중...</p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="border-t border-neutral-200 bg-white">
            <div className="border-b border-neutral-200 px-4 py-4">
              <p className="text-sm font-semibold">마이페이지 메뉴</p>
            </div>
            <div className="px-4 py-6 text-sm text-neutral-500">로딩...</div>
          </aside>

          <section className="border-t border-neutral-200 bg-white">
            <div className="border-b border-neutral-200 px-4 py-4">
              <p className="text-sm font-semibold">주문/배송 조회</p>
              <p className="text-xs text-neutral-500">로딩...</p>
            </div>
            <div className="px-4 py-10 text-center text-sm text-neutral-500">
              주문 내역을 불러오는 중입니다.
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

