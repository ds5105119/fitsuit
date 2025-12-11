"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkBase =
    "text-sm uppercase tracking-[0.22em] transition-colors hidden md:inline";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/95 text-black shadow-[0_20px_80px_rgba(0,0,0,0.2)] backdrop-blur-md"
          : "bg-transparent text-white"
      }`}
    >
      <div className="mx-auto grid max-w-6xl grid-cols-3 items-center gap-4 py-3 px-6">
        <Link
          href="/"
          className="flex items-center gap-3 text-lg font-semibold tracking-[0.18em]"
        >
          <div className="relative h-12 aspect-524/132 overflow-hidden">
            <Image
              alt="Gold Finger"
              src="/images/logo.png"
              fill
              className="object-cover"
              priority
            />
          </div>
        </Link>

        <nav className="flex items-center justify-center gap-6">
          <a
            className={`${linkBase} ${
              scrolled ? "text-black hover:text-amber-700" : "text-white hover:text-amber-200"
            }`}
            href="#atelier"
          >
            Atelier
          </a>
          <a
            className={`${linkBase} ${
              scrolled ? "text-black hover:text-amber-700" : "text-white hover:text-amber-200"
            }`}
            href="#services"
          >
            Services
          </a>
          <a
            className={`${linkBase} ${
              scrolled ? "text-black hover:text-amber-700" : "text-white hover:text-amber-200"
            }`}
            href="#story"
          >
            Heritage
          </a>
          <Link
            className={`${linkBase} ${
              scrolled ? "text-black hover:text-amber-700" : "text-white hover:text-amber-200"
            }`}
            href="/contact"
          >
            Contact
          </Link>
        </nav>

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
