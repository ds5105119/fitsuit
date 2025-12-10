"use client";

import { useState } from "react";

type FormState = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<FormState>("idle");
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
      onSubmit={async (event) => {
        event.preventDefault();
        setStatus("submitting");
        setError(null);

        const form = event.currentTarget;
        const data = new FormData(form);

        const response = await fetch("/api/inquiry", {
          method: "POST",
          body: data,
        });

        if (!response.ok) {
          const payload = await response.json().catch(() => null);
          setError(payload?.error || "제출에 실패했습니다. 다시 시도해주세요.");
          setStatus("error");
          return;
        }

        form.reset();
        setStatus("success");
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm text-white/80">
          <span className="block text-xs uppercase tracking-[0.2em] text-amber-200">
            이름 *
          </span>
          <input
            required
            name="name"
            placeholder="홍길동"
            className="w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-white outline-none ring-amber-300/40 focus:border-amber-200 focus:ring-2"
          />
        </label>
        <label className="space-y-2 text-sm text-white/80">
          <span className="block text-xs uppercase tracking-[0.2em] text-amber-200">
            이메일 *
          </span>
          <input
            required
            name="email"
            type="email"
            placeholder="you@example.com"
            className="w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-white outline-none ring-amber-300/40 focus:border-amber-200 focus:ring-2"
          />
        </label>
      </div>

      <label className="space-y-2 text-sm text-white/80">
        <span className="block text-xs uppercase tracking-[0.2em] text-amber-200">
          연락처
        </span>
        <input
          name="phone"
          placeholder="010-0000-0000"
          className="w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-white outline-none ring-amber-300/40 focus:border-amber-200 focus:ring-2"
        />
      </label>

      <label className="space-y-2 text-sm text-white/80">
        <span className="block text-xs uppercase tracking-[0.2em] text-amber-200">
          문의 내용 *
        </span>
        <textarea
          required
          name="message"
          rows={4}
          placeholder="맞춤 수트 상담 요청 내용을 남겨주세요."
          className="w-full rounded-2xl border border-white/15 bg-black/40 px-3 py-3 text-white outline-none ring-amber-300/40 focus:border-amber-200 focus:ring-2"
        />
      </label>

      <label className="space-y-2 text-sm text-white/80">
        <span className="block text-xs uppercase tracking-[0.2em] text-amber-200">
          참고 파일 업로드
        </span>
        <input
          name="attachment"
          type="file"
          className="w-full cursor-pointer rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-white file:mr-3 file:cursor-pointer file:rounded-lg file:border-none file:bg-amber-400 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-black hover:file:bg-amber-300"
        />
        <p className="text-xs text-white/50">룩북, 원단 사진 등 첨부 가능</p>
      </label>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-black shadow-[0_15px_45px_rgba(255,193,7,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_55px_rgba(255,193,7,0.45)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "submitting" ? "전송 중..." : "문의 보내기"}
        </button>
        {status === "success" && (
          <span className="text-sm text-amber-200">
            접수 완료! 곧 연락드리겠습니다.
          </span>
        )}
        {status === "error" && error && (
          <span className="text-sm text-red-200">{error}</span>
        )}
      </div>
    </form>
  );
}
