"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { signOut } from "next-auth/react";

export default function MyPageSidebar({
  orders,
}: {
  orders: {
    id: string;
    createdAt: Date;
    userEmail: string;
    userName: string | null;
    status: string;
    selections: unknown;
    measurements: unknown;
    previewUrl: string | null;
    originalUpload: string | null;
    backgroundPreview: string | null;
  }[];
}) {
  const pathname = usePathname();

  return (
    <aside className="w-60">
      <div className="border-b border-neutral-200 px-4 pb-4">
        <p className="text-sm font-semibold">마이페이지 메뉴</p>
      </div>
      <nav className="px-2 py-3 text-sm flex flex-col space-y-4">
        <div className="flex flex-col">
          <p className="font-bold px-3 py-2">주문/배송</p>
          <Link
            href="/mypage/orders"
            className={cn(
              "flex items-center justify-between px-3 py-2 hover:bg-neutral-200 rounded-lg",
              pathname === "/mypage/orders" && "bg-neutral-200/60 font-semibold"
            )}
          >
            <span>주문/배송 조회</span>
            <span className="text-xs text-neutral-500">{orders.length}</span>
          </Link>
        </div>

        <hr className="border-neutral-200" />

        <div className="flex flex-col">
          <p className="font-bold px-3 py-2">문의</p>
          <Link
            href="/mypage/contact"
            className={cn(
              "flex items-center justify-between px-3 py-2 hover:bg-neutral-200 rounded-lg",
              pathname === "/mypage/contact" && "bg-neutral-200/60 font-semibold"
            )}
          >
            <span>이전 문의내역</span>
          </Link>
          <Link
            href="http://pf.kakao.com/_xgqxbQu/chat"
            target="_blank"
            rel="noreferrer"
            className={cn("flex items-center justify-between px-3 py-2 hover:bg-neutral-200 rounded-lg")}
          >
            <span>실시간 문의</span>
          </Link>
          <Link
            href="/mypage/faq"
            className={cn(
              "flex items-center justify-between px-3 py-2 hover:bg-neutral-200 rounded-lg",
              pathname === "/mypage/faq" && "bg-neutral-200/60 font-semibold"
            )}
          >
            <span>자주 묻는 질문</span>
          </Link>
        </div>

        <hr className="border-neutral-200" />

        <div className="flex flex-col">
          <p className="font-bold px-3 py-2">나의 정보</p>
          <Link
            href="/mypage/modify"
            className={cn(
              "flex items-center justify-between px-3 py-2 hover:bg-neutral-200 rounded-lg",
              pathname === "/mypage/modify" && "bg-neutral-200/60 font-semibold"
            )}
          >
            <span>내 정보 수정</span>
          </Link>
        </div>

        <hr className="border-neutral-200" />

        <button className="flex items-center justify-between px-3 py-2 hover:bg-neutral-200 rounded-lg" onClick={() => signOut()}>
          로그아웃
        </button>
      </nav>
    </aside>
  );
}
