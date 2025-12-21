"use client";

import { Button } from "@/components/ui/button";
import { ZapIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { LenisProvider } from "@/components/lenis-provider";
import Link from "next/link";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

import { bespokeSteps, cardItems } from "@/lib/constants";

export default function HomePage() {
  const [cardHovered, setCardHovered] = useState<number | null>(null);

  return (
    <LenisProvider>
      <main className="min-h-screen bg-black text-white">
        <section className="relative min-h-screen overflow-hidden">
          <video autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover">
            <source src="/images/main-video.mp4" type="video/mp4" />
          </video>

          <div className="absolute h-full w-full bg-linear-to-b from-black/0 via-black/0 to-black" />
        </section>

        <section className="mx-auto py-36 md:py-56">
          <div className="grid gap-10 max-w-6xl px-6 items-center mx-auto">
            <div className="space-y-5">
              <p className="text-base font-medium leading-relaxed sm:text-sm">Vision</p>
              <p className="text-5xl font-light leading-tight text-white sm:text-7xl font-instrument">
                We create bespoke garments that merge design vision with master craftsmanship.
              </p>
              <p className="text-sm leading-relaxed text-white/70 sm:text-base lg:w-[70%] break-keep">
                비스포크 수트는 기성복이나 일반 맞춤(MTM)과는 차원이 다릅니다. 고객의 직업과 자세, 생활 습관, 그리고 취향까지 세밀하게 반영하여 전용 패턴을
                새롭게 제작하며, 원단과 안감, 단추, 세부 디자인까지 모두 고객이 직접 선택할 수 있습니다. 그 결과 완성되는 수트는 세상에 단 하나뿐인, 오직 한
                사람만을 위한 작품입니다.
              </p>
            </div>
          </div>
        </section>

        <section className="w-full bg-white text-black">
          <div className="mx-auto flex flex-col gap-4 px-6">
            <div className="w-full grid-cols-3 gap-12 pt-12 px-6 hidden lg:grid" onMouseLeave={() => setCardHovered(null)}>
              {cardItems.map((item, idx) => (
                <div
                  key={item.src}
                  className={`col-span-3 md:col-span-1 transition-transform duration-500 ease-out ${cardHovered === idx ? "scale-105" : "scale-100"}`}
                  onMouseEnter={() => setCardHovered(idx)}
                >
                  <div className="relative aspect-3/4 w-full overflow-hidden">
                    {/* 이미지 자체 확대 */}
                    <Image alt={item.alt} src={item.src} fill priority className="object-cover" />
                    {/* 나머지 이미지 위에 살짝 하얀 오버레이 */}
                    <div
                      className={`pointer-events-none absolute inset-0 bg-white/40 transition-opacity duration-300 ${
                        cardHovered !== null && cardHovered !== idx ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  </div>
                  <div className="pt-4 text-xs lg:text-sm">
                    <p className="font-bold">{item.title}</p>
                    <p>{item.discription}</p>
                  </div>
                </div>
              ))}
            </div>

            <Carousel className="lg:hidden pt-6">
              <CarouselContent>
                {cardItems.map((item, idx) => (
                  <CarouselItem key={idx}>
                    <div className="relative aspect-3/4 w-full overflow-hidden">
                      <Image alt={item.alt} src={item.src} fill priority className="object-cover" />
                    </div>
                    <div className="pt-4 text-xs lg:text-sm">
                      <p className="font-bold">{item.title}</p>
                      <p>{item.discription}</p>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious variant="ghost" className="left-2 text-white top-1/2 -translate-y-1/2" />
              <CarouselNext variant="ghost" className="right-2 text-white top-1/2 -translate-y-1/2" />
            </Carousel>

            <div className="max-w-3xl mx-auto text-lg pt-12 flex flex-col items-center">
              <div>
                <p className="text-base font-medium leading-relaxed sm:text-sm text-center">Custom Made</p>
                <p className="text-3xl font-bold leading-relaxed sm:text-4xl text-center">
                  &lsquo;가치&rsquo;를 찾는 여정,
                  <br />
                  대한민국 양복 명장이 도와드리겠습니다.
                </p>
                <p className="text-sm lg:text-base leading-relaxed">
                  당신만을 위한 여정은 마스터 테일러와의 창의적인 대화에서 시작됩니다. 희소한 고급 원단들 중에서 상상할 수 있는 모든 생동감 있는 색상과 패턴을
                  함께 선택하며, 당신이 그리는 이상적인 모습을 하나씩 구체화해 나갑니다. 예상치 못한 안감, 호화로운 단추, 그리고 완성도를 높여 주는 각종 마감
                  디테일까지 — 모든 요소가 당신의 꿈을 실현하기 위한 하나의 과정으로 세심하게 고려됩니다. 비스포크 경험 전반에 걸쳐 마스터 테일러는 오랜 시간
                  이어져 온 전통적인 수제 기법으로 당신만의 작품을 빚어냅니다. 이는 개성 있는 캐주얼 웨어, 니트웨어, 아우터, 가죽 제품, 액세서리, 혹은 테일러드
                  수트까지 어떤 아이템이든 마찬가지입니다. 이렇게 탄생한 디자인들은 전 세계 어디에서도 찾아볼 수 없는, 오직 당신만을 위한 단 하나의
                  결과물입니다. 사용되는 원단, 구성 방식, 디테일에 어떠한 제한도 없습니다.
                </p>
              </div>

              <div className="flex flex-col space-y-4 pt-16 items-center">
                <div>
                  <Button>더 알아보기</Button>
                </div>
                <div>
                  <Button variant="outline" className="px-5" asChild>
                    <Link href="/ai">
                      <ZapIcon className="text-blue-500" /> AI 슈트 디자인 시작하기
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full bg-white text-black pt-36">
          <div className="flex flex-col space-y-48">
            {bespokeSteps.slice(0, 2).map((step, idx) => (
              <div key={step.title} className="grid px-6 lg:px-24 items-center gap-10 mx-auto lg:grid-cols-5">
                <div className={cn("relative aspect-4/3 w-full overflow-hidden lg:col-span-3", idx % 2 === 1 && "lg:order-2")}>
                  <Image alt={step.title} src={step.image} fill priority className="object-cover" />
                </div>

                <div className={cn("flex flex-col gap-6 lg:col-span-2", idx % 2 === 1 && "lg:order-1")}>
                  <p className="text-sm leading-relaxed text-black sm:text-base font-bold">{step.title}</p>
                  <p className="text-sm leading-relaxed text-black/70 sm:text-base whitespace-pre-line">{step.subtitle}</p>
                </div>
              </div>
            ))}

            <div>
              <div className="relative w-full aspect-22/9 lg:aspect-28/9 overflow-hidden">
                <Image alt="이정구 명장 도쿄 우승" src="/images/도쿄 인증서.png" fill priority className="object-cover" />
              </div>

              <div className="pt-4 px-6 lg:px-24 text-xs lg:text-sm">
                <p className="font-bold">금메달</p>
                <p>도쿄 국제기능올림픽</p>
              </div>
            </div>

            {bespokeSteps.slice(2, 4).map((step, idx) => (
              <div key={step.title} className="grid px-6 lg:px-24 items-center gap-10 mx-auto lg:grid-cols-5">
                <div className={cn("relative aspect-4/3 w-full overflow-hidden lg:col-span-3", idx % 2 === 1 && "lg:order-2")}>
                  <Image alt={step.title} src={step.image} fill priority className="object-cover" />
                </div>

                <div className={cn("flex flex-col gap-6 lg:col-span-2", idx % 2 === 1 && "lg:order-1")}>
                  <p className="text-sm leading-relaxed text-black sm:text-base font-bold">{step.title}</p>
                  <p className="text-sm leading-relaxed text-black/70 sm:text-base whitespace-pre-line">{step.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="w-full bg-white text-black pt-36">
          {" "}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-6">
            <div className="order-2 lg:order-1 lg:col-span-1">
              <div className="relative aspect-square w-full overflow-hidden">
                <Image alt="원단" src="/images/fabric1.png" fill priority className="object-cover" />
              </div>

              <div className="pt-4 text-xs lg:text-sm">
                <p className="font-bold">Super 180's</p>
                <p>PIACENZA 1733</p>
              </div>
            </div>
            <div className="order-1 lg:order-2 lg:col-span-2">
              <div className="relative aspect-3/4 w-full overflow-hidden bg-gray-100">
                <Image alt="모델" src="/images/suit1.png" fill priority className="object-cover" />
              </div>

              <div className="pt-4 text-xs lg:text-sm">
                <p className="font-bold">스트라입 슈트</p>
                <p>네이비 핀</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </LenisProvider>
  );
}
