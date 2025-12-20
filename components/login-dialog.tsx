"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { XIcon } from "lucide-react";

type Props = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  callbackUrl: string;
  onCloseHref?: string;
};

export function LoginDialog({ open, defaultOpen = false, onOpenChange, callbackUrl, onCloseHref = "/" }: Props) {
  const router = useRouter();
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = typeof open === "boolean";
  const currentOpen = isControlled ? open : internalOpen;

  const safeCallback = useMemo(() => {
    if (callbackUrl.startsWith("/")) return callbackUrl;
    return "/mypage";
  }, [callbackUrl]);

  return (
    <Dialog
      open={currentOpen}
      onOpenChange={(next) => {
        if (!isControlled) setInternalOpen(next);
        onOpenChange?.(next);
        if (!next && onCloseHref) router.push(onCloseHref);
      }}
    >
      <DialogContent showClose={false} className="w-full h-full max-w-none rounded-none p-0 sm:h-auto sm:max-w-md sm:rounded-xl">
        <div className="relative flex h-full flex-col">
          <DialogHeader className="sr-only">
            <DialogTitle>로그인</DialogTitle>
            <DialogDescription>주문 조회 및 컨시어지 주문 전송을 위해 로그인해 주세요.</DialogDescription>
          </DialogHeader>

          <DialogClose asChild>
            <button className="bg-white flex items-center justify-center w-6 h-6 shrink-0 rounded-full absolute right-3 top-3">
              <XIcon className="size-4" />
            </button>
          </DialogClose>

          <h2 className="border-b text-center border-neutral-200 px-5 py-6 text-xl font-bold sm:px-6">
            로그인하고 <br />
            간편하게 비스포크 시작하기
          </h2>

          <div className="flex-1 px-5 py-6 sm:px-6">
            <button
              onClick={() => signIn("google", { redirectTo: safeCallback })}
              className="inline-flex h-11 w-full items-center justify-center border border-neutral-300 bg-neutral-900 px-4 text-sm font-semibold text-white hover:bg-neutral-800"
            >
              Google로 로그인
            </button>
          </div>

          <div className="pb-4">
            <p className="mt-3 text-xs text-neutral-500 text-center">로그인 시 이용약관 및 개인정보처리방침에 동의한 것으로 간주됩니다.</p>
          </div>

          <DialogFooter className="sr-only" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
