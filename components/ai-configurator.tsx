"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import NextImage from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";

type ConfigOption = {
  id: string;
  group?: string;
  title: string;
  subtitle: string;
  image: string;
};

type CategoryKey = "사진 업로드" | "원단" | "재킷" | "바지" | "조끼" | "코트" | "셔츠" | "구두";
type WearCategory = Exclude<CategoryKey, "사진 업로드">;
type SelectionState = Record<WearCategory, Record<string, ConfigOption>>;

const defaultSelections: Record<WearCategory, Record<string, string>> = {
  원단: { default: "fabric-havana" },
  재킷: { "여밈 방식": "closure-2b", Color: "jacket-charcoal", Pattern: "jacket-navy-pin" },
  바지: { default: "trousers-flat" },
  조끼: { default: "waistcoat-none" },
  코트: { default: "coat-chesterfield" },
  셔츠: { default: "shirt-white" },
  구두: { default: "shoes-oxford" },
};

const tabs: CategoryKey[] = ["사진 업로드", "원단", "재킷", "바지", "조끼", "코트", "셔츠", "구두"];

const catalog: Record<WearCategory, ConfigOption[]> = {
  원단: [
    { id: "fabric-samsung-ipp160", title: "삼성 1PP 160's", subtitle: "Samsung", image: "" },
    { id: "fabric-loro-150", title: "로로 피아나 150's", subtitle: "Loro Piana", image: "" },
    { id: "fabric-zegna", title: "제냐", subtitle: "Ermenegildo Zegna", image: "" },
    { id: "fabric-piacenza", title: "피아첸짜", subtitle: "Piacenza", image: "" },
    { id: "fabric-drago160", title: "드라고 160's", subtitle: "DRAGO", image: "" },
    { id: "fabric-samsung-cheilain", title: "삼성 CHEILAIN", subtitle: "Samsung", image: "" },
    { id: "fabric-delfino", title: "델피노", subtitle: "DELFINO", image: "" },
    { id: "fabric-drago130", title: "드라고 130's", subtitle: "DRAGO", image: "" },
    { id: "fabric-samsung-vip", title: "삼성 VIP", subtitle: "Samsung", image: "" },
    { id: "fabric-canonico", title: "카노니코", subtitle: "Canonico", image: "" },
    { id: "fabric-etomas", title: "이토마스", subtitle: "E.Tomas", image: "" },
    { id: "fabric-samsung-tim", title: "삼성 템테이션", subtitle: "Samsung", image: "" },
    { id: "fabric-samsung-prestige", title: "삼성 프레스티지", subtitle: "Samsung", image: "" },
    { id: "fabric-marche", title: "마르케", subtitle: "Marche", image: "" },
    { id: "fabric-bonavido", title: "보나비도", subtitle: "Bonavido", image: "" },
    { id: "fabric-jijamji", title: "지잠지", subtitle: "Local Select", image: "" },
  ],

  재킷: [
    {
      id: "closure-1b",
      group: "여밈 방식",
      title: "1 버튼",
      subtitle: "블랙 타이 착장에 이상적인, 테이퍼드한 우아한 실루엣을 선사합니다.",
      image: "",
    },
    {
      id: "closure-2b",
      group: "여밈 방식",
      title: "2 버튼",
      subtitle: "가장 활용도 높은 모던 스탠다드 재킷입니다.",
      image: "",
    },
    {
      id: "closure-2_5b",
      group: "여밈 방식",
      title: "2.5 버튼",
      subtitle: "롤 라인 안쪽의 숨은 3번째 단추로 부드러운 롤을 연출할 수 있습니다.",
      image: "",
    },
    {
      id: "closure-6db",
      group: "여밈 방식",
      title: "6 버튼 더블 브레스티드",
      subtitle: "모던하면서도 클래식한 정통 더블 실루엣을 선사합니다.",
      image: "",
    },
    {
      id: "closure-6db-low",
      group: "여밈 방식",
      title: "6 버튼 로우 더블 브레스티드",
      subtitle: "낮은 단추 위치로 대담하고 스포티한 더블 실루엣을 선사합니다.",
      image: "",
    },
    // 색상 (Solid)
    {
      id: "jacket-black",
      group: "색상",
      title: "블랙",
      subtitle: "가장 포멀한 블랙 원단으로, 이브닝 웨어와 격식 있는 자리에도 적합합니다.",
      image: "",
    },
    {
      id: "jacket-charcoal",
      group: "색상",
      title: "차콜",
      subtitle: "은은한 트윌 조직의 딥 차콜 색상으로, 광택을 최소화해 포멀·비즈니스 상황 모두에 어울립니다.",
      image: "",
    },
    {
      id: "jacket-navy-plain",
      group: "색상",
      title: "네이비",
      subtitle: "한국 남성 수트의 표준이라 할 수 있는 네이비로, 첫 맞춤과 데일리 수트에 모두 적합합니다.",
      image: "",
    },
    {
      id: "jacket-midgrey-plain",
      group: "색상",
      title: "미드 그레이",
      subtitle: "너무 무겁지도, 너무 밝지도 않은 중간 톤 그레이로, 사계절 비즈니스 수트로 활용도가 높습니다.",
      image: "",
    },
    {
      id: "jacket-lightgrey-plain",
      group: "색상",
      title: "라이트 그레이",
      subtitle: "가벼운 톤의 라이트 그레이로, 봄·여름 시즌이나 세미 포멀 연출에 잘 어울립니다.",
      image: "",
    },
    {
      id: "jacket-brown-plain",
      group: "색상",
      title: "다크 브라운",
      subtitle: "차분한 다크 브라운 톤으로, 클래식하면서도 개성을 드러내고 싶은 분께 추천드립니다.",
      image: "",
    },
    // 패턴 (Pattern)
    {
      id: "jacket-navy-pin",
      group: "패턴",
      title: "핀스트라이프",
      subtitle: "가느다란 스트라이프가 더해진 원단으로, 클래식 비즈니스 수트의 정석 같은 인상을 줍니다.",
      image: "",
    },
    {
      id: "jacket-navy-chalk",
      group: "패턴",
      title: "초크스트라이프",
      subtitle: "초크로 그린 듯한 굵은 스트라이프가 들어간 원단으로, 존재감 있는 비즈니스·포멀 룩을 완성합니다.",
      image: "",
    },
    {
      id: "jacket-grey-window",
      group: "패턴",
      title: "윈도우페인",
      subtitle: "윈도우페인 체크가 들어간 원단으로, 격식은 유지하면서도 한층 캐주얼한 분위기를 연출합니다.",
      image: "",
    },
    {
      id: "jacket-glen-check",
      group: "패턴",
      title: "글렌 체크",
      subtitle: "잔잔한 격자가 겹쳐진 클래식 글렌 체크로, 영국식 테일러링 무드를 좋아하시는 분께 어울립니다.",
      image: "",
    },
    {
      id: "jacket-micro-check",
      group: "패턴",
      title: "마이크로 체크",
      subtitle: "멀리서 보면 솔리드처럼 보이는 아주 작은 체크 패턴으로, 차분하지만 지루하지 않은 표면감을 제공합니다.",
      image: "",
    },
  ],

  바지: [
    // 실루엣
    {
      id: "trousers-flat",
      group: "실루엣",
      title: "노턱 (플랫 프론트)",
      subtitle: "허리부터 깔끔하게 떨어지는 기본 수트 팬츠 실루엣.",
      image: "",
    },
    {
      id: "trousers-pleat",
      group: "실루엣",
      title: "원턱 (싱글 플리츠)",
      subtitle: "허리 앞쪽에 한 줄 턱이 들어가 여유롭고 편안한 실루엣.",
      image: "",
    },
    {
      id: "trousers-double",
      group: "실루엣",
      title: "투턱 (더블 플리츠)",
      subtitle: "두 줄 턱으로 허벅지에 여유를 주어 클래식한 느낌을 강조합니다.",
      image: "",
    },
    // 밑단 마감
    {
      id: "trousers-hem-plain",
      group: "밑단 마감",
      title: "기본 마감",
      subtitle: "턴업 없이 떨어지는 가장 정석적인 밑단 마감.",
      image: "",
    },
    {
      id: "trousers-cuff",
      group: "밑단 마감",
      title: "턴업 4cm",
      subtitle: "4cm 턴업으로 적당히 클래식한 밸런스를 연출합니다.",
      image: "",
    },
    {
      id: "trousers-cuff-5",
      group: "밑단 마감",
      title: "턴업 5cm",
      subtitle: "5cm 턴업으로 존재감 있고 클래식한 실루엣을 완성합니다.",
      image: "",
    },
  ],

  조끼: [
    {
      id: "waistcoat-none",
      group: "조끼",
      title: "조끼 없음",
      subtitle: "투피스 수트로 재킷과 바지만 착용합니다.",
      image: "",
    },
    {
      id: "waistcoat-single",
      group: "조끼",
      title: "싱글 브레스티드 조끼",
      subtitle: "가장 클래식하고 활용도 높은 기본 조끼 스타일.",
      image: "",
    },
    {
      id: "waistcoat-double",
      group: "조끼",
      title: "더블 브레스티드 조끼",
      subtitle: "더블 여밈으로 포멀하고 존재감 있는 실루엣.",
      image: "",
    },
    {
      id: "waistcoat-u",
      group: "조끼",
      title: "U넥 조끼",
      subtitle: "넓게 파인 U넥 라인으로 타이와 셔츠를 강조합니다.",
      image: "",
    },
    {
      id: "waistcoat-lapel",
      group: "조끼",
      title: "라펠 조끼",
      subtitle: "조끼에도 라펠이 들어간, 한층 드레시한 스타일.",
      image: "",
    },
  ],

  코트: [
    {
      id: "coat-chesterfield",
      group: "코트",
      title: "체스터필드 코트",
      subtitle: "차콜 컬러의 클래식 싱글 코트로 수트 위에 가장 무난한 선택.",
      image: "",
    },
    {
      id: "coat-polo",
      group: "코트",
      title: "폴로 코트",
      subtitle: "카멜 컬러의 벨티드 더블 코트로, 캐시미어 느낌의 포근한 무드.",
      image: "",
    },
    {
      id: "coat-balmacaan",
      group: "코트",
      title: "발마칸 코트",
      subtitle: "래글런 소매와 히든 버튼으로 여유로운 A라인 실루엣.",
      image: "",
    },
    {
      id: "coat-overcoat-db",
      group: "코트",
      title: "더블 오버코트",
      subtitle: "더블 브레스티드 여밈의 포멀한 겨울용 코트.",
      image: "",
    },
    {
      id: "coat-car",
      group: "코트",
      title: "카 코트",
      subtitle: "무릎 위 길이의 경쾌한 코트로, 캐주얼·비즈니스 캐주얼에 적합합니다.",
      image: "",
    },
  ],

  셔츠: [
    {
      id: "shirt-white",
      group: "셔츠",
      title: "화이트 팝린 셔츠",
      subtitle: "가장 기본이 되는 드레스 셔츠로, 어떤 수트와도 자연스럽게 어울립니다.",
      image: "",
    },
    {
      id: "shirt-blue",
      group: "셔츠",
      title: "라이트 블루 옥스퍼드 셔츠",
      subtitle: "조금 더 부드럽고 캐주얼한 인상의 기본 셔츠.",
      image: "",
    },
    {
      id: "shirt-stripe",
      group: "셔츠",
      title: "블루 스트라이프 셔츠",
      subtitle: "잔 스트라이프로 비즈니스 수트에 리듬감을 더해줍니다.",
      image: "",
    },
    {
      id: "shirt-wide",
      group: "셔츠",
      title: "와이드 칼라 셔츠",
      subtitle: "넓게 벌어진 칼라로 넥타이를 우아하게 받쳐줍니다.",
      image: "",
    },
    {
      id: "shirt-band",
      group: "셔츠",
      title: "밴드 칼라 셔츠",
      subtitle: "노타이 스타일에 어울리는 미니멀한 셔츠.",
      image: "",
    },
  ],

  구두: [
    {
      id: "shoes-oxford",
      group: "구두",
      title: "블랙 옥스퍼드 (스트레이트 팁)",
      subtitle: "가장 포멀한 비즈니스·포멀용 드레스 슈즈.",
      image: "",
    },
    {
      id: "shoes-loafer",
      group: "구두",
      title: "브라운 로퍼",
      subtitle: "수트와 캐주얼 모두에 활용 가능한 기본 로퍼.",
      image: "",
    },
    {
      id: "shoes-oxford-brown",
      group: "구두",
      title: "다크 브라운 옥스퍼드",
      subtitle: "블랙보다 부드러운 인상의 클래식 드레스 슈즈.",
      image: "",
    },
    {
      id: "shoes-monk",
      group: "구두",
      title: "브라운 더블 몽크 스트랩",
      subtitle: "버클 디테일로 개성을 살리는 세미 포멀 슈즈.",
      image: "",
    },
    {
      id: "shoes-suede-loafer",
      group: "구두",
      title: "다크 브라운 스웨이드 로퍼",
      subtitle: "위켄드 수트·캐주얼에 어울리는 부드러운 질감의 로퍼.",
      image: "",
    },
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

const findOptionById = (cat: WearCategory, id: string) => catalog[cat].find((opt) => opt.id === id);

export function AIConfigurator() {
  const [activeTab, setActiveTab] = useState<CategoryKey>("사진 업로드");
  const [activeGroup, setActiveGroup] = useState<Partial<Record<WearCategory, string | null>>>({});
  const [presetOpen, setPresetOpen] = useState(false);
  const [activePreset, setActivePreset] = useState(0);

  const buildInitialSelections = (): SelectionState => {
    const state = {} as SelectionState;
    (Object.keys(catalog) as WearCategory[]).forEach((cat) => {
      const groupMap: Record<string, ConfigOption> = {};
      const defaults = defaultSelections[cat] || {};
      const allGroups = new Set<string>();

      catalog[cat].forEach((opt) => {
        allGroups.add(opt.group ?? "default");
      });

      allGroups.forEach((groupKey) => {
        const desiredId = defaults[groupKey];
        const fallback = catalog[cat].find((opt) => (opt.group ?? "default") === groupKey);
        const option = (desiredId && findOptionById(cat, desiredId)) || fallback;
        if (option) {
          groupMap[groupKey] = option;
        }
      });

      state[cat] = groupMap;
    });
    return state;
  };

  const [selected, setSelected] = useState<SelectionState>(buildInitialSelections);
  const cloneSelections = (input: SelectionState) => JSON.parse(JSON.stringify(input)) as SelectionState;
  const [presets, setPresets] = useState(() =>
    Array.from({ length: 3 }).map((_, idx) => ({
      id: idx,
      name: `프리셋 ${idx + 1}`,
      selections: cloneSelections(buildInitialSelections()),
      previewUrl: "",
    }))
  );
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [previewOwner, setPreviewOwner] = useState(0);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [originalUpload, setOriginalUpload] = useState<string | null>(null);
  const [backgroundPreview, setBackgroundPreview] = useState<string | null>(null);
  const [uploadProcessing, setUploadProcessing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const tabScrollRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragPosRef = useRef<{ x: number; scroll: number }>({ x: 0, scroll: 0 });
  const applyingPresetRef = useRef(false);
  const skipSaveRef = useRef(false);

  const handleSelect = (category: WearCategory, groupKey: string, option: ConfigOption) => {
    setSelected((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [groupKey]: option,
      },
    }));
  };

  const getGroups = (category: WearCategory) => {
    if (!catalog[category]) return [];
    const seen = new Set<string>();
    const groups: string[] = [];
    catalog[category].forEach((opt) => {
      if (opt.group && !seen.has(opt.group)) {
        seen.add(opt.group);
        groups.push(opt.group);
      }
    });
    return groups;
  };

  useEffect(() => {
    if (activeTab === "사진 업로드") return;
    const category = activeTab as WearCategory;
    const groups = getGroups(category);
    setActiveGroup((prev) => ({
      ...prev,
      [category]: prev[category] && groups.includes(prev[category]!) ? prev[category] : null,
    }));
  }, [activeTab]);

  const getSelectedOption = (category: WearCategory, group?: string) => {
    const key = group ?? "default";
    return selected[category]?.[key];
  };

  const requestBackgroundRemoval = async (imageDataUrl: string) => {
    const res = await fetch("/api/ai/remove-background", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userImage: imageDataUrl }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error((data as any).error || "배경 제거에 실패했습니다.");
    }

    return isValidImageSrc((data as any).imageUrl) ?? imageDataUrl;
  };

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadProcessing(true);
    setError(null);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const result = reader.result;
      if (typeof result === "string") {
        let normalized: string | null = null;
        try {
          normalized = await normalizeToFourThree(result);
          setOriginalUpload(normalized);
          setBackgroundPreview(null);
          const bgRemoved = await requestBackgroundRemoval(normalized);
          setBackgroundPreview(bgRemoved);
          setUserImage(bgRemoved);
          setPreviewUrl(bgRemoved);
          setPreviewOwner(activePreset);
        } catch (e: any) {
          const fallback = normalized ?? (typeof result === "string" ? result : null);
          setOriginalUpload(fallback);
          setUserImage(fallback);
          if (fallback) {
            setPreviewUrl(fallback);
            setPreviewOwner(activePreset);
          }
          setError(e?.message || "이미지 전처리 또는 배경 제거에 실패했습니다.");
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

  useEffect(() => {
    // 현재 활성 프리셋에 마지막 편집 및 생성된 이미지(미리보기) 자동 저장
    if (applyingPresetRef.current || skipSaveRef.current) {
      applyingPresetRef.current = false;
      skipSaveRef.current = false;
      return;
    }
    setPresets((prev) =>
      prev.map((preset, idx) => {
        if (idx !== activePreset) return preset;
        return {
          ...preset,
          selections: cloneSelections(selected),
          previewUrl: previewOwner === activePreset ? previewUrl : preset.previewUrl,
        };
      })
    );
  }, [selected, activePreset, previewUrl, previewOwner]);

  const handleApplyPreset = (index: number) => {
    applyingPresetRef.current = true;
    skipSaveRef.current = true;
    setActivePreset(index);
    const target = presets[index];
    setSelected(cloneSelections(target.selections));
    // preview 동기화는 아래 activePreset 의존 effect에서 처리
  };

  useEffect(() => {
    // 프리셋 전환 시 해당 프리셋에 저장된 프리뷰만 노출
    skipSaveRef.current = true;
    const target = presets[activePreset];
    setPreviewUrl(target?.previewUrl || "");
    setPreviewOwner(activePreset);
    const id = requestAnimationFrame(() => {
      skipSaveRef.current = false;
    });
    return () => cancelAnimationFrame(id);
  }, [activePreset, presets]);

  const generatePreview = async () => {
    if (loading) return;
    const requestPreset = activePreset;
    const selectionSnapshot = cloneSelections(selected);
    setLoading(true);
    setError(null);
    try {
      const selectionPayload = Object.entries(selected).flatMap(([cat, groupMap]) =>
        Object.entries(groupMap || {}).map(([groupKey, option]) => ({
          category: cat,
          group: groupKey === "default" ? null : groupKey,
          title: option.title,
          subtitle: option.subtitle,
        }))
      );

      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selections: selectionPayload,
          userImage,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "합성 요청에 실패했습니다.");
      }

      const data = await res.json();
      const safe = isValidImageSrc(data.imageUrl) ?? "/images/suit1.png";
      setPresets((prev) => prev.map((preset, idx) => (idx === requestPreset ? { ...preset, selections: selectionSnapshot, previewUrl: safe } : preset)));
      if (activePreset === requestPreset) {
        setPreviewUrl(safe);
        setPreviewOwner(requestPreset);
      }
    } catch (err: any) {
      setError(err.message || "합성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col xl:flex-row h-full w-full relative">
      <div className="relative h-full flex flex-col gap-6">
        <div className="relative h-full xl:aspect-square 2xl:aspect-4/3 overflow-hidden">
          {previewUrl ? (
            <NextImage alt="맞춤 자켓 프리뷰" src={previewUrl} fill className="object-contain" priority />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p>전신 사진을 업로드해 주세요.</p>
            </div>
          )}
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

      <div className="relative flex flex-col grow min-w-0 bg-white">
        <div className="relative flex flex-col h-[calc(100%-5rem)] items-center">
          {(() => {
            const cat = activeTab as WearCategory;
            const groups = getGroups(cat);
            const hasGroups = groups.length > 0;
            return activeTab !== "사진 업로드" && hasGroups && activeGroup[cat] ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveGroup((prev) => ({ ...prev, [cat]: null }))}
                  className="h-20 font-semibold text-neutral-600 hover:text-neutral-900"
                >
                  ← 목록으로
                </button>
                <span className="text-xs text-neutral-500">{activeGroup[cat]}</span>
              </div>
            ) : (
              <div
                ref={tabScrollRef}
                className="px-6 h-20 items-center w-full flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide"
                onMouseDown={(e) => {
                  isDraggingRef.current = true;
                  dragPosRef.current = { x: e.clientX, scroll: tabScrollRef.current?.scrollLeft ?? 0 };
                }}
                onMouseMove={(e) => {
                  if (!isDraggingRef.current || !tabScrollRef.current) return;
                  const delta = e.clientX - dragPosRef.current.x;
                  tabScrollRef.current.scrollLeft = dragPosRef.current.scroll - delta;
                }}
                onMouseUp={() => {
                  isDraggingRef.current = false;
                }}
                onMouseLeave={() => {
                  isDraggingRef.current = false;
                }}
              >
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "rounded-full px-4 py-2 font-medium transition select-none",
                      activeTab === tab ? "border-black bg-black text-white shadow-[0_10px_30px_-18px_rgba(0,0,0,0.6)]" : ""
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            );
          })()}

          {activeTab === "사진 업로드" && (
            <div className="w-full mt-auto flex flex-col gap-3">
              <div className="relative hidden xl:block w-full h-full overflow-hidden">
                {originalUpload ? (
                  <div className="relative h-full overflow-hidden">
                    {originalUpload ? (
                      <NextImage alt="업로드한 전신 사진" src={originalUpload} fill className="object-contain" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-neutral-500">전신 사진을 업로드하세요.</div>
                    )}
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-neutral-500">전신 사진을 업로드하면 바로 프리뷰를 볼 수 있습니다.</div>
                )}
              </div>

              <input id="user-image-input" type="file" accept="image/*" onChange={handleUpload} className="hidden" />

              <label
                htmlFor="user-image-input"
                className="flex shrink-0 items-center justify-center w-full h-20 bg-neutral-900 text-white text-sm md:text-base font-medium cursor-pointer hover:bg-neutral-800 transition-colors"
              >
                전신 사진 업로드하기
              </label>
            </div>
          )}

          {activeTab !== "사진 업로드" && (
            <>
              {(() => {
                const cat = activeTab as WearCategory;
                const groups = getGroups(cat);
                const hasGroups = groups.length > 0;

                if (hasGroups && !activeGroup[cat]) {
                  return (
                    <div className="flex flex-col w-full h-[180px] xl:h-[calc(100%-5rem)] px-6 gap-3 overflow-y-auto pt-2 pb-6">
                      {groups.map((group) => {
                        const current = getSelectedOption(cat, group);
                        return (
                          <button
                            key={group}
                            onClick={() => setActiveGroup((prev) => ({ ...prev, [cat]: group }))}
                            className="flex w-full items-center text-left gap-4 p-2 rounded-md group"
                          >
                            {current?.image && (
                              <div className="relative h-32 w-32 overflow-hidden rounded-sm">
                                <NextImage alt={`${group} 미리보기`} src={current.image} fill className="object-cover" />
                              </div>
                            )}
                            <div className="flex-1">
                              <p className="text-base font-semibold text-neutral-900 group-hover:text-neutral-400">{group}</p>
                              <p className="text-sm text-neutral-600 group-hover:text-neutral-400">{current?.title ?? "선택 안 함"}</p>
                            </div>
                            <div className="text-neutral-900 group-hover:text-neutral-400">›</div>
                          </button>
                        );
                      })}
                    </div>
                  );
                }

                return (
                  <div className="flex flex-col w-full h-[180px] xl:h-[calc(100%-5rem)]">
                    <div className="flex flex-col w-full px-6 gap-3 overflow-y-auto pt-2 pb-6">
                      {catalog[cat]
                        .filter((option) => {
                          if (!hasGroups) return true;
                          return option.group === activeGroup[cat];
                        })
                        .map((option, idx, arr) => {
                          const groupKey = option.group ?? "default";
                          const isActive = getSelectedOption(cat, groupKey)?.id === option.id;
                          const prev = idx > 0 ? arr[idx - 1] : null;
                          const showGroup = !hasGroups && option.group && option.group !== prev?.group;
                          return (
                            <div key={option.id}>
                              {showGroup && <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">{option.group}</p>}
                              <button
                                onClick={() => {
                                  if (isActive) {
                                    setSelected((prev) => {
                                      const next = { ...prev };
                                      const catMap = { ...(next[cat] || {}) };
                                      delete catMap[groupKey];
                                      next[cat] = catMap;
                                      return next;
                                    });
                                  } else {
                                    handleSelect(cat, groupKey, option);
                                  }
                                }}
                                className={`flex w-full items-center text-left gap-4 p-2 rounded-md group ${
                                  isActive ? "shadow-[0_0_0_4px_rgba(0,0,0,0.2)]" : ""
                                }`}
                              >
                                {option.image && (
                                  <div className="relative h-32 w-32 overflow-hidden rounded-sm">
                                    <NextImage alt={`${option.title} 미리보기`} src={option.image} fill className="object-cover" />
                                  </div>
                                )}
                                <div className="flex-1">
                                  <p className="text-base font-semibold text-neutral-900 group-hover:text-neutral-400">{option.title}</p>
                                  <p className="text-sm text-neutral-600 group-hover:text-neutral-400">{option.subtitle}</p>
                                </div>
                                <div className="text-sm font-semibold text-neutral-900 group-hover:text-neutral-400">›</div>
                              </button>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                );
              })()}
            </>
          )}
        </div>

        <div className="flex items-center w-full">
          <button
            className={`flex items-center justify-center w-1/2 h-20 text-black transition ${
              loading ? "bg-neutral-200 cursor-not-allowed opacity-70" : "bg-neutral-300 hover:bg-neutral-400"
            }`}
            onClick={generatePreview}
            disabled={loading}
            aria-busy={loading}
          >
            AI 합성
          </button>
          <button
            className={`flex items-center justify-center w-1/2 h-20 text-white transition ${
              loading ? "bg-neutral-600 cursor-not-allowed opacity-70" : "bg-neutral-700 hover:bg-neutral-800"
            }`}
            onClick={generatePreview}
          >
            컨시어지 문의
          </button>
        </div>
        {error && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      </div>

      <div className="absolute left-4 bottom-4 z-20 flex flex-col-reverse items-start gap-3">
        <button
          type="button"
          onClick={() => setPresetOpen((open) => !open)}
          className="flex items-center gap-2 rounded-full bg-neutral-900 w-18 justify-center py-2 text-white shadow-lg hover:bg-neutral-800 transition"
        >
          <span className="text-sm font-semibold">프리셋</span>
        </button>

        <AnimatePresence>
          {presetOpen && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.2 }}
              className="space-y-2"
            >
              {presets.map((preset, idx) => {
                const isActive = idx === activePreset;
                return (
                  <motion.button
                    type="button"
                    key={preset.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2, delay: idx * 0.03 }}
                    onClick={() => handleApplyPreset(idx)}
                    className={cn(
                      "flex items-center gap-2 rounded-full w-18 justify-center text-sm py-2 backdrop-blur duration-300 transform-color",
                      isActive ? "bg-neutral-300 text-neutral-900" : "bg-white/95 text-neutral-900"
                    )}
                  >
                    {preset.name}
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
