"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BriefcaseBusinessIcon, ChevronDownIcon, MapPinIcon, Menu, UserIcon, XIcon } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { LoginDialog } from "@/components/login-dialog";

import { mainNav, secondaryNav } from "@/lib/constants";
import { useScroll } from "@/hooks/use-scroll";

export function SiteHeader() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const isScrolled = useScroll(40);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { status } = useSession();
  const isAuthed = status === "authenticated";
  const [loginOpen, setLoginOpen] = useState(false);
  const isHome = pathname === "/";
  const callbackUrl = `${pathname}${searchParams?.toString() ? `?${searchParams.toString()}` : ""}`;
  const scrolled = !isHome || isScrolled;

  useEffect(() => {
    setSheetOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (status === "unauthenticated" && pathname?.startsWith("/ai")) {
      setLoginOpen(true);
    }
  }, [status, pathname]);

  const toneClass = scrolled ? "text-neutral-900" : "text-white";
  const headerBg = scrolled ? "bg-white/70 text-neutral-900 shadow-[0_20px_80px_rgba(0,0,0,0.08)] backdrop-blur-md" : "bg-transparent";

  return (
    <>
      <header className={cn("fixed inset-x-0 top-0 z-50 transition-colors duration-300", headerBg)}>
        <div className={cn("mx-auto flex justify-between items-center gap-4 h-16 lg:h-20 px-6", toneClass)}>
          <div className="flex space-x-12 items-center">
            <Link href="/" className="shrink-0 flex items-center justify-start gap-3 text-lg font-mediu tracking-[0.18em]">
              <div className="relative h-8 lg:h-12 aspect-346/87 overflow-hidden">
                <Image alt="Gold Finger" src="/images/logo-4.png" fill className="object-cover" priority />
              </div>
            </Link>

            <div className="shrink-0 hidden lg:flex items-center justify-start">
              <nav className="flex space-x-6 text-xs font-normal transition-colors">
                {mainNav.map((item) => (
                  <Link key={item.href + item.label} href={item.href} onClick={() => setSheetOpen(false)}>
                    {item.label}
                  </Link>
                ))}
                {secondaryNav.map((item) => (
                  <Link key={item.href + item.label} href={item.href} onClick={() => setSheetOpen(false)}>
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="shrink-0 hidden lg:flex items-center justify-end">
              <nav className="flex items-center space-x-6 text-xs font-medium transition-colors">
                <Tooltip>
                  <TooltipTrigger asChild>
                    {isAuthed ? (
                      <Link href="/mypage/orders">
                        <UserIcon size="1.2rem" />
                      </Link>
                    ) : (
                      <button type="button" className="cursor-pointer" onClick={() => setLoginOpen(true)} aria-label="마이페이지 로그인">
                        <UserIcon size="1.2rem" />
                      </button>
                    )}
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>마이페이지</p>
                  </TooltipContent>
                </Tooltip>

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
                    <Link href="/showroom">
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

            {isAuthed ? (
              <Link href="/mypage/orders" className="lg:hidden" aria-label="마이페이지">
                <UserIcon />
              </Link>
            ) : (
              <button type="button" className="lg:hidden cursor-pointer" onClick={() => setLoginOpen(true)} aria-label="마이페이지 로그인">
                <UserIcon />
              </button>
            )}

            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger>
                <Menu className="lg:hidden" />
              </SheetTrigger>
              <SheetContent showClose={false} side="left" className="w-full sm:max-w-md p-0">
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
                      {mainNav.slice(0, 4).map((item) => (
                        <Link key={item.href + item.label} href={item.href} onClick={() => setSheetOpen(false)}>
                          {item.label}
                        </Link>
                      ))}
                    </nav>

                    <div className="w-10 h-px bg-black" />

                    <nav className="flex flex-col space-y-3 text-lg font-semibold">
                      {secondaryNav.map((item) => (
                        <Link key={item.href + item.label} href={item.href} onClick={() => setSheetOpen(false)}>
                          {item.label}
                        </Link>
                      ))}
                    </nav>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} callbackUrl={callbackUrl} onCloseHref="" />
    </>
  );
}
