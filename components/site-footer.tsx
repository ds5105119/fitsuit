"use client";

import Link from "next/link";
import { FacebookIcon, InstagramIcon, Mail, Phone } from "lucide-react";
import { mainNav, secondaryNav } from "@/components/site-header";

const policyLinks = [
  { label: "쿠키 설정", href: "/legal/cookies" },
  { label: "법적 고지", href: "/legal/notice" },
  { label: "개인정보 처리방침", href: "/legal/privacy" },
  { label: "채용", href: "/careers" },
];

const socials = [
  { icon: InstagramIcon, label: "Instagram", href: "https://www.instagram.com/gold_finger_bespoke_tailor/" },
  { icon: FacebookIcon, label: "Facebook", href: "https://www.facebook.com/goldfingerkorea" },
];

export function SiteFooter() {
  return (
    <footer className="bg-neutral-900 text-neutral-200">
      <div className="mx-auto px-6 py-6 lg:px-10 lg:pt-10">
        <div className="grid gap-12 grid-cols-1 lg:grid-cols-[1fr_1fr_1fr_1fr]">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold">
              <Phone size={18} />
              <span>전화</span>
            </div>
            <div className="space-y-2 text-xs leading-relaxed">
              <p className="tracking-[0.12em]">+82 02-556-1144</p>
              <p className="tracking-[0.08em]">월요일-토요일</p>
              <p className="tracking-[0.08em]">09:30 am-19:30 pm (KR Time)</p>
              <Link href="tel:025561144" className="underline underline-offset-4">
                전화 문의
              </Link>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold pt-4">
              <Mail size={18} />
              <span>이메일</span>
            </div>
            <div className="space-y-2 text-xs leading-relaxed">
              <p>24시간 내에 회신</p>
              <Link href="mailto:01mlee@naver.com" className="underline underline-offset-4">
                메시지 보내기
              </Link>
            </div>
          </div>

          <div className="text-xs flex col-span-2">
            <div className="space-y-4 w-1/2">
              {mainNav.map((item) => (
                <Link key={item.href + item.label} href={item.href} className="block hover:text-white">
                  {item.label}
                </Link>
              ))}
              {secondaryNav.map((item) => (
                <Link key={item.href + item.label} href={item.href} className="block hover:text-white">
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="space-y-4 w-1/2">
              {policyLinks.map((item) => (
                <Link key={item.href + item.label} href={item.href} className="block hover:text-white">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex lg:justify-end">
            <div className="flex flex-col items-start lg:items-center">
              <p className="mb-4 text-right text-xs text-neutral-400">Gold Finger 팔로우</p>
              <div className="flex justify-end items-center gap-4">
                {socials.map(({ icon: Icon, label, href }) => (
                  <Link key={href} href={href} aria-label={label} className="hover:text-white">
                    <Icon size={18} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-neutral-800 pt-6 text-[10px] text-neutral-400 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-x-3 tracking-[0.08em]">
            <span>대한민국</span>
            <span>© 2025 GOLDFINGER.</span>
          </div>
          <p className="tracking-[0.04em]">​서울시 강남구 봉은사로 524 웨스틴 서울 파르나스 지하 아케이드 C-17, 골드핑거 양복점</p>
        </div>
      </div>
    </footer>
  );
}
