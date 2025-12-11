import Image from "next/image";
import Link from "next/link";

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

        <div className="absolute h-full w-full bg-linear-to-b from-black/0 via-black/0 to-black"/>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24 md:py-48">
        <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div className="space-y-5">
              <p className="text-xs uppercase tracking-[0.24em] text-amber-200">
                비전
              </p>
              <div className="h-px w-10 bg-amber-300" />
            <p className="text-3xl font-[var(--font-playfair)] font-semibold leading-relaxed text-white sm:text-4xl">
              가치를 아는,
              <br />
              가치있는 분을 위한,
              <br />
              가치있는 옷.
            </p>
            <p className="text-sm leading-relaxed text-white/70 sm:text-base">
              비스포크 수트는 기성복이나 일반 맞춤(MTM)과는 차원이 다릅니다.
              고객의 직업과 자세, 생활 습관, 그리고 취향까지 세밀하게 반영하여
              전용 패턴을 새롭게 제작하며, 원단과 안감, 단추, 세부 디자인까지
              모두 고객이 직접 선택할 수 있습니다. 그 결과 완성되는 수트는
              세상에 단 하나뿐인, 오직 한 사람만을 위한 작품입니다.
            </p>
          </div>
          <div className="flex justify-center">
            <Image
              alt="Tailor stitching a bespoke suit"
              src="/images/%E1%84%89%E1%85%B5%E1%84%8E%E1%85%B5%E1%86%B7%20%E1%84%89%E1%85%A1%E1%84%8C%E1%85%B5%E1%86%AB.avif"
              width={640}
              height={420}
              className="h-auto w-full max-w-xl object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <section className="w-full bg-white py-14 text-black">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6">
          <p className="text-xs uppercase tracking-[0.24em] text-amber-600">
            서비스
          </p>
          <div className="h-px w-10 bg-black" />
          <p className="text-3xl font-[var(--font-playfair)] font-semibold leading-relaxed sm:text-4xl">
            &lsquo;가치&rsquo;를 찾는 여정,
            <br />
            대한민국 양복 명장이 도와드리겠습니다.
          </p>
        </div>
      </section>

      <section
        id="atelier"
        className="relative z-10 mx-auto mt-28 max-w-6xl px-6 py-16"
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
                className="p-5 text-sm text-white/80"
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
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-center">
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
                  className="p-4 text-sm text-white/80"
                >
                  {item}
                </div>
              ))}
            </div>
            <Link
              href="/ai"
              className="inline-flex items-center gap-2 rounded-full border border-amber-200/60 px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-amber-100 transition hover:-translate-y-0.5 hover:border-amber-100"
            >
              AI 정장 맞추기
              <span aria-hidden>→</span>
            </Link>
          </div>
          <div className="space-y-4 rounded-[18px] bg-black/20 p-6">
            <div className="flex gap-3">
              <div className="h-16 w-16 rounded-lg bg-white/5" />
              <div className="flex-1 rounded-lg bg-white/5 p-3">
                <div className="h-3 w-1/2 rounded-full bg-white/30" />
                <div className="mt-2 h-3 w-1/3 rounded-full bg-amber-300/60" />
              </div>
            </div>
            <div className="rounded-xl bg-white/5 p-4">
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
                    className="rounded-lg bg-black/40 p-3 text-center text-sm text-white/80"
                  >
                    {label} 선택
                  </div>
                ))}
              </div>
              <div className="mt-4 h-40 rounded-lg bg-gradient-to-b from-amber-100/20 via-transparent to-black" />
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
              className="space-y-3 p-2"
            >
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
          ))}
        </div>
      </section>

      <section
        id="story"
        className="mx-auto mb-20 max-w-6xl px-6 text-white/80 sm:mb-28"
      >
        <div className="p-6">
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
            <div className="space-y-4 p-4 text-center">
              <p className="text-sm uppercase tracking-[0.28em] text-amber-200">
                Concierge
              </p>
              <p className="text-lg leading-relaxed text-white/90">
                프라이빗 라운지 예약, 출장 피팅, 원단 큐레이션까지 테일러가 직접
                동행합니다.
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
      </section>
    </main>
  );
}
