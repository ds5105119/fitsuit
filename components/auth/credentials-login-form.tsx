"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { cn } from "@/lib/utils";

type Props = {
  callbackUrl: string;
  className?: string;
};

export function CredentialsLoginForm({ callbackUrl, className }: Props) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setError("아이디와 비밀번호를 입력해 주세요.");
      return;
    }

    setLoading(true);
    setError(null);

    const safeCallback = callbackUrl.startsWith("/") ? callbackUrl : "/mypage/orders";

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: trimmedEmail,
        password,
        callbackUrl: safeCallback,
      });

      if (!res || res.error) {
        setError("아이디 또는 비밀번호가 올바르지 않습니다.");
        return;
      }

      router.replace(res.url ?? safeCallback);
      router.refresh();
    } catch (err) {
      setError("로그인 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn(className)}>
      <div className="space-y-2">
        <div className="space-y-2">
          <label className="block text-neutral-700">
            <span className="text-xs font-semibold text-neutral-500 sr-only">아이디(이메일)</span>
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
          <label className="block text-neutral-700">
            <span className="text-xs font-semibold text-neutral-500 sr-only">비밀번호</span>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              name="password"
              autoComplete="current-password"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              placeholder="비밀번호"
              className="h-12 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-900 outline-none"
            />
          </label>
          <div className="text-neutral-600 text-xs text-center py-1 cursor-pointer hover:text-neutral-800">비밀번호 찾기</div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-12 w-full items-center justify-center rounded-md bg-neutral-900 px-4 text-sm font-semibold text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>

        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    </form>
  );
}
