"use client";

import { Button } from "@/components/ui/button";
import { ZapIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { LenisProvider } from "@/components/lenis-provider";

export default function HomePage() {
  const [cardHovered, setCardHovered] = useState<number | null>(null);

  const cardItems = [
    {
      alt: "원단 선택 사진",
      src: "/images/Bespoke_01 원단 선택.avif",
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
      subtitle: "10여 년간 비스포크 수트를 만들어 온 대한민국 양복 명장의 기술력으로 정성을 다해 수트를 제작합니다.",
      image: "/images/이정구 명장 유년.png",
    },
    {
      title: "Sewing by Hand",
      subtitle: "손바느질로 완성한 비접착 방식의 수트는 형태 변형이 적어 입을수록 고객의 체형에 맞추어집니다.",
      image: "/images/Bespoke_08 가봉.avif",
    },
    {
      title: "CAD System",
      subtitle: "정교한 맞춤 의복 자동패턴 시스템으로 차별화된 실루엣과 완성도를 제공합니다.",
      image: "/images/Bespoke_04_1 패턴 출력 CAD.avif",
    },
    {
      title: "Wearing Sensation",
      subtitle: "오랜 경험과 노하우로 어떤 체형의 고객이라도 만족할 수 있는 편안한 착용감을 선사합니다.",
      image: "/images/Bespoke_12 손바느질 마감.avif",
    },
  ];

  return (
    <LenisProvider>
      {" "}
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
              <p className="text-base font-medium leading-relaxed sm:text-sm text-center">Custom Made</p>
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

            <div className="w-full grid grid-cols-3 gap-12 pt-20 px-6" onMouseLeave={() => setCardHovered(null)}>
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

            <div className="max-w-3xl mx-auto text-lg font-semibold pt-20 flex flex-col items-center">
              <p>
                Your unique experience begins with a creative conversation with our Master Tailor, who will bring your vision to life using a selection of rare
                fabrics woven in every imaginable vibrant colour and pattern. Unexpected linings, luxurious buttons and other finishing touches are all
                considered as a part of the realisation of your dream. Throughout the Bespoke experience our Master Tailor will handcraft your masterpiece in a
                ritual of time-honoured techniques, whether it’s unique casual pieces, knitwear, outerwear, leather goods, accessories or tailored suiting. The
                resulting designs can’t be found anywhere else in the world, with no limits on fabrics, construction or detailing.
              </p>

              <div className="flex flex-col space-y-4 pt-24 items-center">
                <div>
                  <Button>더 알아보기</Button>
                </div>
                <div>
                  <Button variant="outline" className="px-5">
                    <ZapIcon className="text-blue-500" /> AI 슈트 디자인 시작하기
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6">
            <div className="order-2 md:order-1 md:col-span-1">
              <div className="relative aspect-square w-full overflow-hidden">
                <Image alt="원단" src="/images/fabric1.png" fill priority className="object-cover" />
              </div>

              <div className="pt-4 text-xs md:text-sm">
                <p className="font-bold">Super 180's</p>
                <p>PIACENZA 1733</p>
              </div>
            </div>
            <div className="order-1 md:order-2 md:col-span-2">
              <div className="relative aspect-3/4 w-full overflow-hidden bg-gray-100">
                <Image alt="모델" src="/images/suit1.png" fill priority className="object-cover" />
              </div>

              <div className="pt-4 text-xs md:text-sm">
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
