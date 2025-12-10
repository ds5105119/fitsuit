import Link from "next/link";
import { VirtualFit } from "@/components/virtual-fit";

export const metadata = {
  title: "AI 정장 맞추기 | GOLD FINGER",
};

export default function AIPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black px-6 py-14 text-white">
      <div className="mx-auto max-w-6xl space-y-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-amber-200">
              AI Virtual Fit
            </p>
            <h1 className="font-[var(--font-playfair)] text-4xl font-semibold tracking-wide text-white sm:text-5xl">
              전신 사진에 입혀보는 AI 정장 맞추기
            </h1>
            <p className="mt-2 max-w-3xl text-base text-white/70">
              전신 사진을 업로드하고 셔츠, 재킷, 팬츠, 타이까지 선택해보세요.
              원하는 조합을 미리 확인한 뒤 바로 상담을 이어갈 수 있습니다.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full border border-amber-200/60 bg-white/5 px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-amber-100 backdrop-blur transition hover:-translate-y-0.5 hover:border-amber-100"
          >
            컨시어지 문의 →
          </Link>
        </div>

        <VirtualFit />

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
          <p className="font-semibold text-white">
            참고: 본 데모는 프론트엔드 미리보기입니다.
          </p>
          <p className="mt-2">
            실제 서비스에서는 업로드한 사진을 비공개 Blob 저장소에 보관하고,
            선택한 룩 조합에 따라 AI 합성을 수행한 뒤 결과를 제공합니다. 연동할
            인퍼런스 API를 지정해주시면 바로 연결해드리겠습니다.
          </p>
        </div>
      </div>
    </main>
  );
}
