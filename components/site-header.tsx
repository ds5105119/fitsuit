"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { BriefcaseBusinessIcon, ChevronDownIcon, MapPinIcon, Menu, XIcon } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const pathname = usePathname();

  const updateScrolled = useCallback(() => {
    const canScroll = document.documentElement.scrollHeight - window.innerHeight > 8;
    setScrolled(!canScroll || window.scrollY > 40);
  }, []);

  useEffect(() => {
    updateScrolled();
    window.addEventListener("scroll", updateScrolled);
    window.addEventListener("resize", updateScrolled);
    return () => {
      window.removeEventListener("scroll", updateScrolled);
      window.removeEventListener("resize", updateScrolled);
    };
  }, [updateScrolled]);

  useEffect(() => {
    // 라우트가 바뀔 때 레이아웃/스크롤 상태를 다시 계산하고 시트를 닫는다.
    const id = requestAnimationFrame(updateScrolled);
    setSheetOpen(false);
    return () => cancelAnimationFrame(id);
  }, [pathname, updateScrolled]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "bg-white/75 text-black shadow-[0_20px_80px_rgba(0,0,0,0.1)] backdrop-blur-md" : "bg-transparent text-white"
      )}
    >
      <div className="mx-auto flex justify-between items-center gap-4 h-16 lg:h-20 px-6">
        <div className="flex space-x-12 items-center">
          <Link href="/" className="shrink-0 flex items-center justify-start gap-3 text-lg font-mediu tracking-[0.18em]">
            <div className="relative h-8 lg:h-12 aspect-346/87 overflow-hidden">
              <Image alt="Gold Finger" src="/images/logo-4.png" fill className="object-cover" priority />
            </div>
          </Link>

          <div className="shrink-0 hidden lg:flex items-center justify-start">
            <nav className="flex space-x-6 text-xs font-normal">
              <Link href="/ai" onClick={() => setSheetOpen(false)}>
                정장 맞추기
              </Link>
              <Link href="/about" onClick={() => setSheetOpen(false)}>
                명장 소개
              </Link>
              <Link href="/showroom" onClick={() => setSheetOpen(false)}>
                매장 안내
              </Link>
              <Link href="/contact" onClick={() => setSheetOpen(false)}>
                문의하기
              </Link>
              <Link href="/about" onClick={() => setSheetOpen(false)}>
                사진 및 동영상
              </Link>
              <Link href="/showroom" onClick={() => setSheetOpen(false)}>
                Works
              </Link>
            </nav>
          </div>
        </div>

        <div className="flex items-center">
          <div className="shrink-0 hidden lg:flex items-center justify-end">
            <nav className="flex items-center space-x-6 text-xs font-medium">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/ai">
                    <BriefcaseBusinessIcon size="1.2rem" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>AI 정장 제작</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/shop">
                    <MapPinIcon size="1.2rem" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>매장 위치</p>
                </TooltipContent>
              </Tooltip>

              <div className="flex items-center gap-1">
                한국어
                <ChevronDownIcon size="1.2rem" />
              </div>
            </nav>
          </div>

          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger>
              <Menu className="lg:hidden" />
            </SheetTrigger>
            <SheetContent side="left" showClose={false} className="w-full sm:max-w-md p-0">
              <SheetHeader className="sr-only">
                <SheetTitle />
                <SheetDescription />
              </SheetHeader>
              <div>
                <div className="h-16 w-full flex items-center justify-end px-6">
                  <XIcon onClick={() => setSheetOpen(false)} />
                </div>

                <div className="pt-6 px-6 space-y-8">
                  <nav className="flex flex-col space-y-3 text-xl font-bold">
                    <Link href="/ai" onClick={() => setSheetOpen(false)}>
                      정장 맞추기
                    </Link>
                    <Link href="/about" onClick={() => setSheetOpen(false)}>
                      명장 소개
                    </Link>
                    <Link href="/showroom" onClick={() => setSheetOpen(false)}>
                      매장 안내
                    </Link>
                    <Link href="/contact" onClick={() => setSheetOpen(false)}>
                      문의하기
                    </Link>
                  </nav>

                  <div className="w-10 h-px bg-black" />

                  <nav className="flex flex-col space-y-3 text-lg font-semibold">
                    <Link href="/about" onClick={() => setSheetOpen(false)}>
                      사진 및 동영상
                    </Link>
                    <Link href="/showroom" onClick={() => setSheetOpen(false)}>
                      Works
                    </Link>
                  </nav>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
