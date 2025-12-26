"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type Props = {
  callbackUrl: string;
  className?: string;
  onSuccess?: (redirectUrl: string | null) => void;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function CredentialsSignupForm({ callbackUrl, className, onSuccess }: Props) {
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;

    const trimmedEmail = email.trim();
    const trimmedName = userName.trim();
    if (!trimmedEmail || !EMAIL_REGEX.test(trimmedEmail)) {
      setError("유효한 이메일을 입력해 주세요.");
      return;
    }
    if (!password || password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다.");
      return;
    }
    if (password !== passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);
    setError(null);

    const safeCallback = callbackUrl.startsWith("/") ? callbackUrl : "/";

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmedEmail,
          password,
          userName: trimmedName || null,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error || "회원가입에 실패했습니다.");
        return;
      }

      const signInResult = await signIn("credentials", {
        redirect: false,
        email: trimmedEmail,
        password,
        callbackUrl: safeCallback,
      });

      if (!signInResult || signInResult.error) {
        setError("로그인에 실패했습니다. 다시 시도해 주세요.");
        return;
      }
      if (onSuccess) {
        onSuccess(signInResult.url ?? safeCallback);
        return;
      }

      window.location.href = signInResult.url ?? safeCallback;
    } catch (err) {
      setError("회원가입 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col h-full", className)}>
      <div className="space-y-3 flex-1">
        <label className="flex flex-col gap-2 text-sm text-neutral-700">
          <span className="font-semibold text-neutral-500">이메일</span>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="text"
            name="email"
            autoComplete="username"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            inputMode="email"
            placeholder="이메일"
            className="h-12 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-900 outline-none"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-neutral-700">
          <span className="font-semibold text-neutral-500">이름(선택)</span>
          <input
            value={userName}
            onChange={(event) => setUserName(event.target.value)}
            type="text"
            name="userName"
            autoComplete="name"
            placeholder="홍길동"
            className="h-12 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-900 outline-none"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-neutral-700">
          <span className="font-semibold text-neutral-500">비밀번호</span>
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            name="password"
            autoComplete="new-password"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            placeholder="비밀번호"
            className="h-12 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-900 outline-none"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-neutral-700">
          <span className="font-semibold text-neutral-500">비밀번호 확인</span>
          <input
            value={passwordConfirm}
            onChange={(event) => setPasswordConfirm(event.target.value)}
            type="password"
            name="passwordConfirm"
            autoComplete="new-password"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            placeholder="비밀번호 확인"
            className="h-12 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-900 outline-none"
          />
        </label>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex h-12 w-full items-center justify-center rounded-md bg-neutral-900 px-4 text-sm font-semibold text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? <Loader2 className="animate-spin" /> : "회원가입"}
      </button>
    </form>
  );
}
