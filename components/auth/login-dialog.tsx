"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { XIcon } from "lucide-react";
import { CredentialsLoginForm } from "@/components/auth/credentials-login-form";
import { CredentialsSignupForm } from "@/components/auth/credentials-signup-form";

type Props = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  callbackUrl?: string;
  onCloseHref?: string;
};

export function LoginDialog({ open, defaultOpen = false, onOpenChange, callbackUrl = "", onCloseHref = "/" }: Props) {
  const router = useRouter();
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = typeof open === "boolean";
  const currentOpen = isControlled ? open : internalOpen;
  const [isSignUp, setIsSignUp] = useState(false);
  const [signUpStep, setSignUpStep] = useState<"start" | "terms" | "form">("start");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const hasCallback = callbackUrl.startsWith("/");
  const safeCallback = useMemo(() => (hasCallback ? callbackUrl : "/mypage"), [callbackUrl, hasCallback]);

  const resetSignUpSteps = () => {
    setSignUpStep("start");
    setTermsAccepted(false);
  };

  const closeDialog = () => {
    if (!isControlled) setInternalOpen(false);
    onOpenChange?.(false);
    setIsSignUp(false);
    resetSignUpSteps();
  };

  const handleSignUpSuccess = (redirectUrl: string | null) => {
    closeDialog();
    if (hasCallback) {
      window.location.href = redirectUrl ?? safeCallback;
      return;
    }
    window.location.reload();
  };

  if (isSignUp) {
    return (
      <Dialog
        open={currentOpen}
        onOpenChange={(next) => {
          if (!isControlled) setInternalOpen(next);
          if (!next) {
            setIsSignUp(false);
            resetSignUpSteps();
          }
          onOpenChange?.(next);
          if (!next && onCloseHref) router.push(onCloseHref);
        }}
      >
        <DialogContent showClose={false} className="w-full h-full max-w-none rounded-none p-0 sm:h-3/4 sm:max-w-sm sm:rounded-xl outline-none overflow-y-auto">
          <div className="relative flex h-full flex-col">
            <DialogHeader className="sr-only">
              <DialogTitle>로그인</DialogTitle>
              <DialogDescription>주문 조회 및 컨시어지 주문 전송을 위해 로그인해 주세요.</DialogDescription>
            </DialogHeader>

            <DialogClose asChild>
              <button className="bg-white flex items-center justify-center w-6 h-6 shrink-0 rounded-full absolute right-3 top-3">
                <XIcon className="size-5" />
              </button>
            </DialogClose>

            {signUpStep === "start" && (
              <>
                <h2 className="text-center px-8 pt-16 sm:pt-12 pb-2 text-[1.375rem] font-black sm:px-6">
                  회원가입하고 <br />
                  간편하게 비스포크 시작하기
                </h2>

                <div className="flex-1 px-8 py-6 sm:px-6 space-y-5">
                  <button
                    onClick={() => signIn("google", { redirectTo: safeCallback })}
                    className="inline-flex h-12 w-full items-center justify-center rounded-md bg-neutral-100 px-4 text-sm font-semibold text-black hover:bg-neutral-200"
                  >
                    <div className="mr-3">
                      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="size-5">
                        <path
                          fill="#EA4335"
                          d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                        ></path>
                        <path
                          fill="#4285F4"
                          d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                        ></path>
                        <path
                          fill="#FBBC05"
                          d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                        ></path>
                        <path
                          fill="#34A853"
                          d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                        ></path>
                        <path fill="none" d="M0 0h48v48H0z"></path>
                      </svg>
                    </div>
                    Google로 시작하기
                  </button>

                  <div className="flex items-center gap-3 text-xs text-neutral-400">
                    <span className="h-px flex-1 bg-neutral-200" />
                    또는
                    <span className="h-px flex-1 bg-neutral-200" />
                  </div>

                  <button
                    onClick={() => {
                      setTermsAccepted(false);
                      setSignUpStep("terms");
                    }}
                    className="inline-flex h-12 w-full items-center justify-center rounded-md bg-neutral-100 px-4 text-sm font-semibold text-black hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    이메일로 시작하기
                  </button>
                </div>

                <div className="text-center text-xs text-neutral-500 px-8 py-6 sm:px-6 space-y-5">
                  <p>이미 계정이 있으신가요?</p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(false);
                      resetSignUpSteps();
                    }}
                    className="inline-flex h-12 w-full items-center justify-center rounded-md bg-neutral-900 px-4 text-sm font-semibold text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    로그인
                  </button>
                </div>
              </>
            )}

            {signUpStep === "terms" && (
              <>
                <h2 className="text-center px-8 pt-16 sm:pt-12 pb-2 text-[1.375rem] font-black sm:px-6">약관 동의</h2>
                <div className="flex-1 px-8 py-6 sm:px-6 space-y-4">
                  <p className="text-xs text-neutral-500">회원가입을 위해 약관에 동의해 주세요.</p>
                  <label className="flex items-start gap-3 rounded-md border border-neutral-200 px-3 py-3 text-sm text-neutral-700">
                    <input type="checkbox" checked={termsAccepted} onChange={(event) => setTermsAccepted(event.target.checked)} className="mt-1 size-4" />
                    <span>
                      <span className="font-semibold text-neutral-900">[필수]</span> 서비스 이용약관 및 개인정보 처리방침에 동의합니다.
                      <span className="mt-2 flex items-center gap-3 text-xs text-neutral-500">
                        <Link href="/legal/notice" className="underline underline-offset-4">
                          이용약관
                        </Link>
                        <Link href="/legal/privacy" className="underline underline-offset-4">
                          개인정보 처리방침
                        </Link>
                      </span>
                    </span>
                  </label>
                </div>
                <div className="px-8 pb-6 sm:px-6 space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSignUpStep("start");
                      setTermsAccepted(false);
                    }}
                    className="inline-flex h-12 w-full items-center justify-center rounded-md bg-neutral-200 px-4 text-sm font-semibold text-neutral-800 hover:bg-neutral-300"
                  >
                    뒤로
                  </button>
                  <button
                    type="button"
                    onClick={() => setSignUpStep("form")}
                    disabled={!termsAccepted}
                    className="inline-flex h-12 w-full items-center justify-center rounded-md bg-neutral-900 px-4 text-sm font-semibold text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    동의하고 계속
                  </button>
                </div>
              </>
            )}

            {signUpStep === "form" && (
              <>
                <h2 className="text-center px-8 pt-16 sm:pt-12 pb-2 text-[1.375rem] font-black sm:px-6">이메일로 회원가입</h2>
                <div className="grow px-8 py-6 sm:px-6 space-y-5">
                  <CredentialsSignupForm callbackUrl={safeCallback} onSuccess={handleSignUpSuccess} />
                </div>
                <button
                  onClick={() => setSignUpStep("start")}
                  className="pb-6 flex items-center justify-center text-neutral-600 text-xs text-center cursor-pointer hover:text-neutral-8000"
                >
                  <p>또는 SNS 계정으로 간편하게 이용하기</p>
                </button>
              </>
            )}

            <DialogFooter className="sr-only" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={currentOpen}
      onOpenChange={(next) => {
        if (!isControlled) setInternalOpen(next);
        onOpenChange?.(next);
        if (!next && onCloseHref) router.push(onCloseHref);
      }}
    >
      <DialogContent showClose={false} className="w-full h-full max-w-none rounded-none p-0 sm:h-3/4 sm:max-w-sm sm:rounded-xl outline-none overflow-y-auto">
        <div className="relative flex h-full flex-col">
          <DialogHeader className="sr-only">
            <DialogTitle>로그인</DialogTitle>
            <DialogDescription>주문 조회 및 컨시어지 주문 전송을 위해 로그인해 주세요.</DialogDescription>
          </DialogHeader>

          <DialogClose asChild>
            <button className="bg-white flex items-center justify-center w-6 h-6 shrink-0 rounded-full absolute right-3 top-3">
              <XIcon className="size-5" />
            </button>
          </DialogClose>

          <h2 className="text-center px-8 pt-16 sm:pt-12 pb-2 text-[1.375rem] font-black sm:px-6">
            로그인하고 <br />
            간편하게 비스포크 시작하기
          </h2>

          <div className="flex-1 px-8 py-6 sm:px-6 space-y-5">
            <CredentialsLoginForm callbackUrl={safeCallback} />

            <div className="flex items-center gap-3 text-xs text-neutral-400">
              <span className="h-px flex-1 bg-neutral-200" />
              또는 SNS 계정으로 간편하게 이용하기
              <span className="h-px flex-1 bg-neutral-200" />
            </div>

            <button
              onClick={() => signIn("google", { redirectTo: safeCallback })}
              className="inline-flex h-12 w-full items-center justify-center rounded-md bg-neutral-100 px-4 text-sm font-semibold text-black hover:bg-neutral-200"
            >
              <div className="mr-3">
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="size-5">
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                  ></path>
                  <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                  ></path>
                  <path
                    fill="#FBBC05"
                    d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                  ></path>
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                  ></path>
                  <path fill="none" d="M0 0h48v48H0z"></path>
                </svg>
              </div>
              Google로 시작하기
            </button>
          </div>

          <div className="text-center text-xs text-neutral-500 px-8 py-6 sm:px-6 space-y-5">
            <p>아직 골드핑거 회원이 아니신가요?</p>
            <button
              onClick={() => setIsSignUp(true)}
              className="inline-flex h-12 w-full items-center justify-center rounded-md bg-neutral-900 px-4 text-sm font-semibold text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              회원가입
            </button>
          </div>

          <DialogFooter className="sr-only" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
