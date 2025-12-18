"use client";

import { Button } from "@/components/ui/button";
import { ZapIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { LenisProvider } from "@/components/lenis-provider";
import Link from "next/link";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const [cardHovered, setCardHovered] = useState<number | null>(null);

  const cardItems = [
    {
      alt: "원단 선택 사진",
      src: "/images/Bespoke_06 재단2_JPG.avif",
    },
    {
      alt: "이정구 명장 사진",
      src: "/images/Bespoke_08 가봉.avif",
    },
    {
      alt: "손바느질 마감 사진",
      src: "/images/Bespoke_12 손바느질 마감.avif",
    },
  ];

  const bespokeSteps = [
    {
      title: "Korean MasterHand",
      subtitle:
        "오직 비스포크 수트 한 길만을 걸어온 대한민국 양복 명장이, 패턴 설계부터 재단·가봉·마감까지 전 공정을 직접 디렉팅합니다. 단순히 치수를 재는 것을 넘어, 고객의 체형적 특징과 자세, 직업, 라이프스타일, 나아가 추구하는 이미지까지 세밀하게 고려해 한 벌의 수트 안에 녹여냅니다. \n\n장인의 눈으로 균형을 잡고, 손끝으로 실루엣을 다듬어, 시간이 지나도 촌스럽지 않은 정통 테일러링의 품격을 구현합니다.",
      image: "/images/이정구 명장 유년.png",
    },
    {
      title: "Sewing by Hand",
      subtitle:
        "본격적인 비스포크 수트의 완성도는 바느질에서 갈립니다. 접착심에 의존하지 않는 비접착(풀 캔버스) 구조 위에 어깨선, 라펠 롤, 가슴 볼륨, 소매 낙차를 대부분 손바느질로 잡아줌으로써, 입으면 입을수록 착용자의 체형에 자연스럽게 길들여지는 입체감을 선사합니다. \n\n기계로 빠르게 봉제한 수트와는 다른 부드러운 움직임과 가벼운 착용감, 그리고 오래 착용해도 흐트러지지 않는 실루엣은 오직 손으로 꿰맨 스티치에서 비롯됩니다.",
      image: "/images/Bespoke_09 수정.avif",
    },
    {
      title: "CAD System",
      subtitle:
        "장인의 경험에 더해, 정교한 맞춤 의복 CAD 시스템을 활용해 고객 개개인의 체형 데이터를 패턴에 정밀하게 반영합니다. 어깨 기울기, 가슴·허리·힙의 비율, 팔 길이와 다리 라인까지 세밀하게 분석하여, 수작업만으로는 놓치기 쉬운 미세한 편차까지 보정합니다. \n\n전통 테일러링의 노하우에 디지털 패턴 기술을 결합함으로써, 보다 균형 잡힌 실루엣과 좌우 대칭, 움직임을 고려한 여유분까지 갖춘 높은 완성도의 패턴을 제공합니다.",
      image: "/images/Bespoke_04_1 패턴 출력 CAD.avif",
    },
    {
      title: "Wearing Sensation",
      subtitle:
        "겉으로 보이는 라인만큼 중요한 것은 실제로 몸에 닿는 순간의 느낌입니다. 장시간 착용해도 어깨가 무겁지 않도록 밸런스를 조정하고, 목 뒤와 등, 허리 라인에 무리가 가지 않도록 인체공학적인 패턴을 적용합니다. \n\n앉고 서고 걷는 모든 동작에서 옷이 몸을 방해하기보다는 자연스럽게 따라오도록 여유분을 설계하며, 이를 수차례의 가봉을 통해 미세 조정합니다. 그 결과, 첫 착용부터 오래 길들인 옷처럼 편안하면서도, 거울 속 실루엣은 언제나 단정하고 품위 있게 유지됩니다.",
      image: "/images/Bespoke_12 손바느질 마감.avif",
    },
  ];

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
            <div className="space-y-5 text-center">
              <p className="text-base font-medium leading-relaxed sm:text-sm text-center">비전</p>
              <p className="text-3xl font-bold leading-normal text-white sm:text-4xl">가치를 아는, 가치있는 분을 위한, 가치있는 옷.</p>
              <p className="text-sm leading-relaxed text-white/70 sm:text-base">
                비스포크 수트는 기성복이나 일반 맞춤(MTM)과는 차원이 다릅니다. 고객의 직업과 자세, 생활 습관, 그리고 취향까지 세밀하게 반영하여 전용 패턴을
                새롭게 제작하며, 원단과 안감, 단추, 세부 디자인까지 모두 고객이 직접 선택할 수 있습니다. 그 결과 완성되는 수트는 세상에 단 하나뿐인, 오직 한
                사람만을 위한 작품입니다.
              </p>
            </div>
          </div>
        </section>

        <section className="w-full bg-white py-36 text-black space-y-36">
          <div className="mx-auto flex flex-col gap-4 px-6">
            <p className="text-base font-medium leading-relaxed sm:text-sm text-center">Custom Made</p>
            <p className="text-3xl font-bold leading-relaxed sm:text-4xl text-center">
              &lsquo;가치&rsquo;를 찾는 여정,
              <br />
              대한민국 양복 명장이 도와드리겠습니다.
            </p>

            <div className="w-full grid-cols-3 gap-12 pt-20 px-6 hidden lg:grid" onMouseLeave={() => setCardHovered(null)}>
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
                </div>
              ))}
            </div>

            <Carousel className="lg:hidden pt-12">
              <CarouselContent>
                {cardItems.map((item, idx) => (
                  <CarouselItem key={idx}>
                    <div className="relative aspect-3/4 w-full overflow-hidden">
                      <Image alt={item.alt} src={item.src} fill priority className="object-cover" />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious variant="ghost" className="left-2 text-white top-1/2 -translate-y-1/2" />
              <CarouselNext variant="ghost" className="right-2 text-white top-1/2 -translate-y-1/2" />
            </Carousel>

            <div className="max-w-3xl mx-auto text-lg pt-12 lg:pt-20 flex flex-col items-center">
              <p className="text-sm lg:text-base leading-relaxed">
                당신만을 위한 여정은 마스터 테일러와의 창의적인 대화에서 시작됩니다. 희소한 고급 원단들 중에서 상상할 수 있는 모든 생동감 있는 색상과 패턴을
                함께 선택하며, 당신이 그리는 이상적인 모습을 하나씩 구체화해 나갑니다. 예상치 못한 안감, 호화로운 단추, 그리고 완성도를 높여 주는 각종 마감
                디테일까지 — 모든 요소가 당신의 꿈을 실현하기 위한 하나의 과정으로 세심하게 고려됩니다. 비스포크 경험 전반에 걸쳐 마스터 테일러는 오랜 시간
                이어져 온 전통적인 수제 기법으로 당신만의 작품을 빚어냅니다. 이는 개성 있는 캐주얼 웨어, 니트웨어, 아우터, 가죽 제품, 액세서리, 혹은 테일러드
                수트까지 어떤 아이템이든 마찬가지입니다. 이렇게 탄생한 디자인들은 전 세계 어디에서도 찾아볼 수 없는, 오직 당신만을 위한 단 하나의 결과물입니다.
                사용되는 원단, 구성 방식, 디테일에 어떠한 제한도 없습니다.
              </p>

              <div className="flex flex-col space-y-4 pt-24 items-center">
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
