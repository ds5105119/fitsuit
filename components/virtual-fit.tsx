"use client";

import { useMemo, useState } from "react";

type ItemType = "shirt" | "jacket" | "pants" | "tie";

const palette: Record<ItemType, { label: string; swatch: string }[]> = {
  shirt: [
    { label: "화이트", swatch: "#f5f5f0" },
    { label: "스카이", swatch: "#b3d1ff" },
    { label: "샴페인", swatch: "#f0dcc2" },
  ],
  jacket: [
    { label: "네이비", swatch: "#0c1a2b" },
    { label: "차콜", swatch: "#1c1c1c" },
    { label: "브라운", swatch: "#3a2516" },
  ],
  pants: [
    { label: "딥 그레이", swatch: "#2c2c2c" },
    { label: "스톤 베이지", swatch: "#b4a88c" },
    { label: "블랙", swatch: "#0b0b0b" },
  ],
  tie: [
    { label: "버건디", swatch: "#6d1f2c" },
    { label: "네이비", swatch: "#142741" },
    { label: "골드", swatch: "#c89b3c" },
  ],
};

export function VirtualFit() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selection, setSelection] = useState<Record<ItemType, string>>({
    shirt: palette.shirt[0].swatch,
    jacket: palette.jacket[0].swatch,
    pants: palette.pants[0].swatch,
    tie: palette.tie[0].swatch,
  });
  const [status, setStatus] = useState<"idle" | "ready">("idle");

  const overlayStyle = useMemo(() => {
    return {
      shirt: selection.shirt,
      jacket: selection.jacket,
      pants: selection.pants,
      tie: selection.tie,
    };
  }, [selection]);

  return (
    <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-start">
      <div className="space-y-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.22em] text-amber-200">
            STEP 1 — 전신 사진 업로드
          </p>
          <label className="mt-3 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-white/25 bg-black/50 px-4 py-10 text-center text-sm text-white/70 transition hover:border-amber-200/80 hover:bg-black/40">
            <input
              className="hidden"
              accept="image/*"
              type="file"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                const url = URL.createObjectURL(file);
                setPreviewUrl(url);
                setStatus("ready");
              }}
            />
            <span className="rounded-full bg-amber-400 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-black">
              Upload
            </span>
            <span>전신이 보이는 정면 사진을 선택하세요.</span>
          </label>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.22em] text-amber-200">
            STEP 2 — 아이템 선택
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {(
              [
                ["셔츠", "shirt"] as const,
                ["재킷", "jacket"] as const,
                ["팬츠", "pants"] as const,
                ["타이", "tie"] as const,
              ] satisfies Array<[string, ItemType]>
            ).map(([label, key]) => (
              <div
                key={key}
                className="rounded-xl border border-white/10 bg-black/40 p-3"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-white/60">
                  {label}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {palette[key].map((option) => (
                    <button
                      key={option.swatch}
                      type="button"
                      onClick={() =>
                        setSelection((prev) => ({ ...prev, [key]: option.swatch }))
                      }
                      className={`flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition ${
                        selection[key] === option.swatch
                          ? "border-amber-300 bg-amber-200/20 text-amber-50"
                          : "border-white/10 bg-white/5 text-white/70 hover:border-amber-200/60"
                      }`}
                    >
                      <span
                        className="h-4 w-4 rounded-full"
                        style={{ background: option.swatch }}
                      />
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-[24px] border border-white/10 bg-white/5 p-4 backdrop-blur">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.22em] text-white/60">
            STEP 3 — 착장 프리뷰
          </p>
          <span className="rounded-full bg-amber-400 px-3 py-1 text-xs font-semibold text-black">
            AI Compose
          </span>
        </div>

        <div className="mt-4 aspect-[3/4] overflow-hidden rounded-[20px] border border-white/10 bg-gradient-to-b from-black via-zinc-900 to-black">
          {previewUrl ? (
            <div className="relative h-full w-full">
              <img
                src={previewUrl}
                alt="업로드 프리뷰"
                className="h-full w-full object-cover opacity-90"
              />
              <div className="pointer-events-none absolute inset-0 mix-blend-screen">
                <div
                  className="absolute left-1/2 top-[30%] h-[22%] w-[48%] -translate-x-1/2 rounded-[18%] blur-[48px]"
                  style={{ background: overlayStyle.jacket }}
                />
                <div
                  className="absolute left-1/2 top-[42%] h-[16%] w-[46%] -translate-x-1/2 rounded-[26%] blur-[42px]"
                  style={{ background: overlayStyle.shirt }}
                />
                <div
                  className="absolute left-1/2 top-[65%] h-[24%] w-[42%] -translate-x-1/2 rounded-[32%] blur-[52px]"
                  style={{ background: overlayStyle.pants }}
                />
                <div
                  className="absolute left-1/2 top-[38%] h-[18%] w-[8%] -translate-x-1/2 rounded-[16px] blur-[32px]"
                  style={{ background: overlayStyle.tie }}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-white/60">
              전신 사진을 업로드하면 착장 프리뷰가 표시됩니다.
            </div>
          )}
        </div>

        <p className="mt-3 text-xs text-white/60">
          시연용 합성입니다. 실제 AI 파이프라인 연동 시 고객 사진을 비공개
          Blob에 저장하고, 선택한 룩으로 자동 합성해 제공합니다.
        </p>

        <button
          type="button"
          disabled={status !== "ready"}
          className="mt-4 w-full rounded-full bg-amber-400 px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-black shadow-[0_12px_35px_rgba(255,193,7,0.3)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_45px_rgba(255,193,7,0.4)] disabled:cursor-not-allowed disabled:opacity-60"
          onClick={() => setStatus("ready")}
        >
          프리뷰 새로고침
        </button>
      </div>
    </div>
  );
}
