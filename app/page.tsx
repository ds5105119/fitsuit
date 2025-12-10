import Link from "next/link";
const highlights = [
  {
    title: "Signature Cuts",
    description: "이탈리안 실루엣과 서울의 세련미를 결합한 맞춤 패턴.",
  },
  {
    title: "Bespoke Craft",
    description: "30년 장인의 핸드 스티칭과 풀 캔버스 공법을 고집합니다.",
  },
  {
    title: "Private Lounge",
    description: "샴페인과 함께하는 1:1 피팅, 나만의 룩을 설계하세요.",
  },
];

const services = [
  "웨딩 & 포멀 수트",
  "비즈니스 테일러링",
  "이브닝 재킷 & 턱시도",
  "리미티드 패브릭 라인",
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="relative min-h-screen overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/images/main-video.mp4" type="video/mp4" />
        </video>
        
        <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-6 pb-10 pt-28">
          <div className="mt-auto grid gap-8 pb-16 pt-20 md:grid-cols-[1.25fr_1fr] md:items-end">
            <div className="space-y-8">
              <p className="text-sm uppercase tracking-[0.24em] text-amber-200/80">
                Seoul Bespoke Atelier
              </p>
              <h1 className="font-[var(--font-playfair)] text-4xl font-light leading-tight tracking-wide text-white sm:text-5xl lg:text-6xl">
                당신만을 위한
                <br />
                <span className="font-semibold text-amber-200">
                  GOLD FINGER
                </span>{" "}
                테일러링
              </h1>
              <p className="max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
                완벽한 실루엣, 손끝에서 빛나는 스티치, 시그니처 골드 라이닝까지.
                첫 피팅부터 완성까지, 장인의 케어로 당신의 스타일을 완성합니다.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-black shadow-[0_15px_45px_rgba(255,193,7,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_55px_rgba(255,193,7,0.45)]"
                >
                  예약 상담 시작
                </Link>
                <a
                  href="#story"
                  className="rounded-full border border-white/30 bg-white/5 px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:-translate-y-0.5 hover:border-amber-200 hover:text-amber-100"
                >
                  브랜드 스토리
                </a>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {highlights.map((item) => (
                <div
                  key={item.title}
                  className="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:-translate-y-1 hover:border-amber-200/60 hover:bg-white/10"
                >
                  <p className="text-xs uppercase tracking-[0.25em] text-amber-200/80">
                    {item.title}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-white/80">
                    {item.description}
                  </p>
                  <div className="mt-4 h-px w-12 bg-gradient-to-r from-amber-400/90 to-transparent opacity-0 transition group-hover:opacity-100" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="atelier"
        className="relative z-10 mx-auto mt-28 max-w-6xl rounded-[32px] border border-white/10 bg-gradient-to-br from-neutral-950 via-black to-amber-950/20 px-6 py-16 shadow-[0_25px_80px_rgba(0,0,0,0.5)] backdrop-blur"
      >
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-center">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.24em] text-amber-200">
              Atelier Signature
            </p>
            <h2 className="font-[var(--font-playfair)] text-3xl font-semibold tracking-wide text-white sm:text-4xl">
              첫 골드 핑거 수트, 당신을 위한 설계도
            </h2>
            <p className="text-base leading-relaxed text-white/70 sm:text-lg">
              골드 핑거는 체형과 라이프스타일을 반영한 패턴 메이킹으로 유명합니다.
              골드 스레드 파이핑, 숨겨진 포켓 디테일, 이중 라펠 선택까지 취향을
              담아 완성합니다.
            </p>
            <div className="flex flex-wrap gap-3">
              {services.map((service) => (
                <span
                  key={service}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.18em] text-white/80"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Full Canvas Construction",
              "Hand Rolled Lapels",
              "Signature Gold Lining",
              "Lifetime Alteration Care",
            ].map((detail) => (
              <div
                key={detail}
                className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-amber-950/[0.15] p-5 text-sm text-white/80 backdrop-blur"
              >
                {detail}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="virtual"
        className="mx-auto mt-12 max-w-6xl px-6 sm:mt-20"
      >
        <div className="grid gap-8 rounded-[28px] border border-white/10 bg-gradient-to-br from-neutral-950 via-black to-amber-950/25 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.45)] md:grid-cols-[1.2fr_1fr] md:items-center">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.24em] text-amber-200">
              Virtual Fit Preview
            </p>
            <h3 className="font-[var(--font-playfair)] text-3xl font-semibold tracking-wide text-white sm:text-4xl">
              AI 정장 맞추기, 전신 사진으로 실시간 확인
            </h3>
            <p className="text-base leading-relaxed text-white/70">
              업로드한 전신 사진 위에 셔츠·재킷·팬츠·타이를 입혀보는 전용 페이지로
              이동합니다. 마음에 드는 조합을 저장하고 바로 상담을 이어가세요.
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                "Look 셀렉션",
                "AI 합성 프리뷰",
                "상담 연결",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80 backdrop-blur"
                >
                  {item}
                </div>
              ))}
            </div>
            <Link
              href="/ai"
              className="inline-flex items-center gap-2 rounded-full border border-amber-200/60 bg-white/5 px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-amber-100 backdrop-blur transition hover:-translate-y-0.5 hover:border-amber-100"
            >
              AI 정장 맞추기
              <span aria-hidden>→</span>
            </Link>
          </div>
          <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-black/40 p-6 backdrop-blur">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,215,128,0.18),transparent_25%),radial-gradient(circle_at_80%_0%,rgba(255,193,7,0.15),transparent_25%)]" />
            <div className="relative z-10 space-y-4">
              <div className="flex gap-3">
                <div className="h-16 w-16 rounded-lg border border-white/15 bg-white/5" />
                <div className="flex-1 rounded-lg border border-white/15 bg-white/5 p-3">
                  <div className="h-3 w-1/2 rounded-full bg-white/30" />
                  <div className="mt-2 h-3 w-1/3 rounded-full bg-amber-300/60" />
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.22em] text-white/60">
                    Outfit Builder
                  </span>
                  <span className="rounded-full bg-amber-400 px-3 py-1 text-xs font-semibold text-black">
                    Preview
                  </span>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {["셔츠", "재킷", "팬츠"].map((label) => (
                    <div
                      key={label}
                      className="rounded-xl border border-white/10 bg-black/40 p-3 text-center text-sm text-white/80"
                    >
                      {label} 선택
                    </div>
                  ))}
                </div>
                <div className="mt-4 h-40 rounded-xl border border-white/10 bg-gradient-to-b from-amber-100/20 via-transparent to-black" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="services"
        className="mx-auto mt-16 max-w-6xl px-6 pb-12 sm:mt-24"
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-amber-200">
              Bespoke Journey
            </p>
            <h3 className="font-[var(--font-playfair)] text-3xl font-semibold tracking-wide text-white sm:text-4xl">
              피팅부터 완성까지, 여정의 모든 순간
            </h3>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-amber-200/50 px-4 py-2 text-xs uppercase tracking-[0.18em] text-amber-100 transition hover:-translate-y-0.5 hover:border-amber-100"
          >
            스페셜리스트에게 문의
            <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Consult & Design",
              copy: "체형 분석과 스타일 컨설팅으로 완벽한 실루엣을 설계합니다.",
            },
            {
              title: "Fitting Sessions",
              copy: "정밀 핀 스티치로 어깨, 라펠, 허리 라인을 맞추어 갑니다.",
            },
            {
              title: "Final Delivery",
              copy: "완성된 수트와 함께 케어 가이드, 사후 리터치 서비스를 제공합니다.",
            },
          ].map((stage, idx) => (
            <div
              key={stage.title}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur transition hover:-translate-y-1 hover:border-amber-200/60"
            >
              <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100">
                <div className="h-full w-full bg-gradient-to-br from-amber-500/20 via-transparent to-white/5" />
              </div>
              <div className="relative z-10 space-y-3">
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-200/80">
                  0{idx + 1}
                </span>
                <h4 className="text-xl font-semibold text-white">
                  {stage.title}
                </h4>
                <p className="text-sm leading-relaxed text-white/70">
                  {stage.copy}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        id="story"
        className="mx-auto mb-20 max-w-6xl px-6 text-white/80 sm:mb-28"
      >
        <div className="rounded-[32px] border border-white/10 bg-gradient-to-r from-black via-neutral-950 to-black p-10 shadow-[0_18px_60px_rgba(0,0,0,0.45)]">
          <div className="grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-center">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.24em] text-amber-200">
                Heritage
              </p>
              <h3 className="font-[var(--font-playfair)] text-3xl font-semibold tracking-wide text-white sm:text-4xl">
                1994년부터 이어온 맞춤의 기준
              </h3>
              <p className="text-base leading-relaxed text-white/70">
                골드 핑거 양복점은 클래식과 현대적 미니멀리즘을 조화시킨
                테일러링을 연구합니다. 수많은 피팅 경험을 토대로 고객의 직업,
                체형, 태도까지 담아내는 수트를 만드는 것이 우리의 철학입니다.
              </p>
              <div className="flex flex-wrap gap-3 text-sm">
                <span className="rounded-full bg-white/5 px-4 py-2 text-white">
                  Bespoke by Appointment
                </span>
                <span className="rounded-full bg-white/5 px-4 py-2 text-white">
                  Premium Loro Piana & Zegna Fabrics
                </span>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-3xl border border-amber-200/30 bg-amber-50/5 p-8 text-center">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,215,128,0.18),transparent_25%),radial-gradient(circle_at_80%_0%,rgba(255,193,7,0.15),transparent_25%)]" />
              <div className="relative z-10 space-y-4">
                <p className="text-sm uppercase tracking-[0.28em] text-amber-200">
                  Concierge
                </p>
                <p className="text-lg leading-relaxed text-white/90">
                  프라이빗 라운지 예약, 출장 피팅, 원단 큐레이션까지
                  테일러가 직접 동행합니다.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full bg-amber-400 px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-black transition hover:-translate-y-0.5"
                >
                  컨시어지에게 문의
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
