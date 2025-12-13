"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Menu, XIcon } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

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
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-white/95 text-black shadow-[0_20px_80px_rgba(0,0,0,0.1)] backdrop-blur-md" : "bg-transparent text-white"
      }`}
    >
      <div className="mx-auto grid grid-cols-3 items-center gap-4 h-16 px-6">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger>
            <Menu />
          </SheetTrigger>
          <SheetContent side="left" showClose={false} className="w-full sm:max-w-md p-0">
            <SheetHeader className="sr-only">
              <SheetTitle />
              <SheetDescription />
            </SheetHeader>
            <div>
              <div className="h-16 flex items-center px-6">
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

        <Link href="/" className="flex items-center justify-center gap-3 text-lg font-semibold tracking-[0.18em]">
          <div className="relative h-10 aspect-346/107 overflow-hidden">
            <Image alt="Gold Finger" src="/images/logo-1.png" fill className="object-cover" priority />
          </div>
        </Link>

        <div className="flex justify-end">
          <Link
            href="/ai"
            className={`hidden rounded-full border px-5 py-2 text-sm font-semibold uppercase tracking-[0.2em] transition md:inline-flex ${
              scrolled
                ? "border-black/15 bg-black text-white hover:-translate-y-0.5 hover:border-black/25"
                : "border-amber-300/60 bg-white/5 text-amber-200 backdrop-blur hover:-translate-y-0.5 hover:border-amber-200 hover:text-white"
            }`}
          >
            정장 맞추기
          </Link>
        </div>
      </div>
    </header>
  );
}
