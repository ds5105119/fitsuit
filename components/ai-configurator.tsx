"use client";

import NextImage from "next/image";
import Link from "next/link";
import { PencilIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChangeEvent, useMemo, useState } from "react";

type ConfigOption = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  priceDelta: number;
};

type CategoryKey = "Fabric" | "Jacket" | "Trousers" | "Waistcoat";

const catalog: Record<CategoryKey, ConfigOption[]> = {
  Fabric: [
    { id: "fabric-havana", title: "Havana Wool", subtitle: "Super 150s / Charcoal", image: "/images/Bespoke_06 재단2_JPG.avif", priceDelta: 0 },
    { id: "fabric-navy", title: "Midnight Twill", subtitle: "Super 130s / Navy", image: "/images/Bespoke_01 원단 선택.avif", priceDelta: 80 },
    { id: "fabric-silk", title: "Silk Blend", subtitle: "Lightweight / Graphite", image: "/images/Bespoke_02 디자인 선택.avif", priceDelta: 140 },
  ],
  Jacket: [
    { id: "closure-2b", title: "Closure", subtitle: "2 Button", image: "/images/suit1.png", priceDelta: 0 },
    { id: "closure-3b", title: "Closure", subtitle: "3 Button Roll", image: "/images/Bespoke_08 가봉.avif", priceDelta: 60 },
    { id: "lapel-peak", title: "Lapel", subtitle: "Peak", image: "/images/Bespoke_11 손바느질 제작.avif", priceDelta: 45 },
    { id: "lapel-notch", title: "Lapel", subtitle: "Notch", image: "/images/Bespoke_07 시침.avif", priceDelta: 0 },
  ],
  Trousers: [
    { id: "trousers-flat", title: "Silhouette", subtitle: "Flat Front", image: "/images/Bespoke_10 심지 제작.avif", priceDelta: 0 },
    { id: "trousers-pleat", title: "Silhouette", subtitle: "Single Pleat", image: "/images/Bespoke_09 수정.avif", priceDelta: 30 },
    { id: "trousers-cuff", title: "Hem", subtitle: "Cuffed 4cm", image: "/images/Bespoke_13 프레스.avif", priceDelta: 25 },
  ],
  Waistcoat: [
    { id: "waistcoat-none", title: "Waistcoat", subtitle: "없음", image: "/images/Bespoke_03 체촌.avif", priceDelta: 0 },
    { id: "waistcoat-single", title: "Waistcoat", subtitle: "Single Breasted", image: "/images/Bespoke_04_1 패턴 출력 CAD.avif", priceDelta: 70 },
  ],
};

const isValidImageSrc = (src: unknown): string | null => {
  if (typeof src !== "string") return null;
  const trimmed = src.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("data:")) return trimmed;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  if (trimmed.startsWith("/")) return trimmed;
  return null;
};

const normalizeToFourThree = (dataUrl: string, fill = "#f5f5f5") =>
  new Promise<string>((resolve, reject) => {
    const img = new globalThis.Image();
    img.onload = () => {
      const targetW = 1200;
      const targetH = Math.round((targetW * 3) / 4);
      const canvas = document.createElement("canvas");
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas not supported"));
        return;
      }
      ctx.fillStyle = fill;
      ctx.fillRect(0, 0, targetW, targetH);
      const scale = Math.min(targetW / img.width, targetH / img.height);
      const drawW = img.width * scale;
      const drawH = img.height * scale;
      const dx = (targetW - drawW) / 2;
      const dy = (targetH - drawH) / 2;
      ctx.drawImage(img, dx, dy, drawW, drawH);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => reject(new Error("이미지를 불러올 수 없습니다."));
    img.src = dataUrl;
  });

export function AIConfigurator() {
  const [activeTab, setActiveTab] = useState<CategoryKey>("Jacket");
  const [selected, setSelected] = useState<Record<CategoryKey, ConfigOption>>({
    Fabric: catalog.Fabric[0],
    Jacket: catalog.Jacket[0],
    Trousers: catalog.Trousers[0],
    Waistcoat: catalog.Waistcoat[0],
  });
  const [previewUrl, setPreviewUrl] = useState<string>("/images/suit1.png");
  const [userImage, setUserImage] = useState<string | null>(null);
  const [uploadProcessing, setUploadProcessing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalPrice = useMemo(() => {
    const base = 920;
    const extra = Object.values(selected).reduce((sum, item) => sum + item.priceDelta, 0);
    return base + extra;
  }, [selected]);

  const handleSelect = (category: CategoryKey, option: ConfigOption) => {
    setSelected((prev) => ({ ...prev, [category]: option }));
  };

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadProcessing(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const result = reader.result;
      if (typeof result === "string") {
        try {
          const normalized = await normalizeToFourThree(result);
          setUserImage(normalized);
        } catch (e: any) {
          setError(e?.message || "이미지 전처리에 실패했습니다.");
        } finally {
          setUploadProcessing(false);
        }
      } else {
        setUploadProcessing(false);
      }
    };
    reader.onerror = () => {
      setUploadProcessing(false);
      setError("이미지를 읽을 수 없습니다.");
    };
    reader.readAsDataURL(file);
  };

  const generatePreview = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selections: selected,
          userImage,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "합성 요청에 실패했습니다.");
      }

      const data = await res.json();
      const safe = isValidImageSrc(data.imageUrl) ?? "/images/suit1.png";
      setPreviewUrl(safe);
    } catch (err: any) {
      setError(err.message || "합성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex h-full w-full">
      <div className="relative h-full flex flex-col gap-6">
        <div className="absolute left-2 top-2 w-full flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.16em] text-neutral-500">Total</p>
            <p className="text-2xl font-semibold text-neutral-900">${totalPrice.toLocaleString()}</p>
            <p className="text-sm text-neutral-500">3-4 week delivery</p>
          </div>
        </div>

        <div className="relative h-full aspect-4/3 overflow-hidden">
          <NextImage alt="맞춤 자켓 프리뷰" src={previewUrl} fill className="object-contain" priority />
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70 text-sm font-semibold text-neutral-700 backdrop-blur-sm">
              AI로 합성 중...
            </div>
          )}
          {uploadProcessing && !loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60 text-xs font-semibold text-neutral-600 backdrop-blur-sm">
              업로드 이미지 정규화 중...
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-6 w-full items-center pt-6">
        <div className="flex flex-wrap gap-3">
          {(Object.keys(catalog) as CategoryKey[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                activeTab === tab ? "border-black bg-black text-white shadow-[0_10px_30px_-18px_rgba(0,0,0,0.6)]" : ""
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-4 shadow-inner">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow ring-1 ring-neutral-200">
                <span className="text-lg font-semibold text-amber-500">A</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-900">Your Style</p>
                <p className="text-xs text-neutral-500">AI 추천 스타일</p>
              </div>
            </div>
            <PencilIcon className="h-5 w-5 text-neutral-500" />
          </div>

          <div className="mt-4 flex flex-col gap-3 rounded-xl border border-dashed border-neutral-300 bg-white/70 p-4 text-sm text-neutral-700">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">내 전신 사진 업로드</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="text-xs text-neutral-600 file:mr-3 file:cursor-pointer file:rounded-full file:border file:border-neutral-300 file:bg-white file:px-3 file:py-1 file:text-xs file:font-semibold file:uppercase file:tracking-[0.12em] file:text-neutral-700 hover:file:border-neutral-400"
              />
            </div>
            {userImage && (
              <div className="flex items-center gap-3">
                <div className="relative h-20 w-26 overflow-hidden rounded-lg ring-1 ring-neutral-200 bg-[#f5f5f5]">
                  <NextImage alt="업로드한 전신 사진" src={userImage} fill className="object-contain" />
                </div>
                <p className="text-xs text-neutral-500">업로드한 사진을 기반으로 AI 합성을 수행합니다.</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 overflow-y-auto pb-2" style={{ maxHeight: "700px" }}>
          {catalog[activeTab].map((option) => {
            const isActive = selected[activeTab].id === option.id;
            return (
              <button
                key={option.id}
                onClick={() => handleSelect(activeTab, option)}
                className={`flex items-center gap-4 rounded-2xl border bg-white p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                  isActive ? "border-black ring-2 ring-black/10" : "border-neutral-200"
                }`}
              >
                <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-neutral-100">
                  <NextImage alt={`${option.title} 미리보기`} src={option.image} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-neutral-900">{option.title}</p>
                  <p className="text-sm text-neutral-600">{option.subtitle}</p>
                  {option.priceDelta !== 0 && <p className="text-xs text-amber-600">+${option.priceDelta}</p>}
                </div>
                <div className={`text-sm font-semibold ${isActive ? "text-black" : "text-neutral-400"}`}>›</div>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700">
          <div>
            <p className="font-semibold text-neutral-900">AI 정장 맞추기</p>
            <p className="text-xs text-neutral-500">조합 완료 후 컨시어지로 이어집니다.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="px-3" onClick={generatePreview} disabled={loading}>
              AI 합성
            </Button>
            <Link
              href="/contact"
              className="rounded-full border border-neutral-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] hover:border-neutral-400"
            >
              컨시어지 문의 →
            </Link>
          </div>
        </div>

        {error && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      </div>
    </section>
  );
}
