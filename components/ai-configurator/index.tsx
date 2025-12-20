"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PreviewPane } from "./preview-pane";
import { TabStrip } from "./tab-strip";
import { UploadPanel } from "./upload-panel";
import { OptionsPanel } from "./options-panel";
import { SummaryView } from "./summary-view";
import { buildInitialSelections, catalog, categoryOrder, tabs } from "./data";
import type { CategoryKey, ConfigOption, Preset, SelectionState, WearCategory } from "./types";
import { isValidImageSrc, normalizeToFourThree } from "./utils";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const STORAGE_KEY = "ai-configurator-state";
const STORAGE_PREVIEW_KEY = "ai-configurator-preview-latest";

export function AIConfigurator() {
  const searchParams = useSearchParams();
  const restoredPreviewRef = useRef<string | null>(null);
  const hydratedRef = useRef(false);
  const [activeTab, setActiveTab] = useState<CategoryKey>("사진 업로드");
  const [activeGroup, setActiveGroup] = useState<Partial<Record<WearCategory, string | null>>>({});
  const [presetOpen, setPresetOpen] = useState(false);
  const [activePreset, setActivePreset] = useState(0);
  const [viewMode, setViewMode] = useState<"config" | "summary">("config");

  const cloneSelections = (input: SelectionState) => JSON.parse(JSON.stringify(input)) as SelectionState;
  const [selected, setSelected] = useState<SelectionState>(buildInitialSelections);
  const [presets, setPresets] = useState<Preset[]>(() =>
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
  const [showAlert, setShowAlert] = useState(false);
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
    if (activeTab === "사진 업로드") return;
    const category = activeTab as WearCategory;
    const groups = getGroups(category);
    setActiveGroup((prev) => ({
      ...prev,
      [category]: prev[category] && groups.includes(prev[category]!) ? prev[category] : null,
    }));
  }, [activeTab]);

  useEffect(() => {
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
    setViewMode("config");
    requestAnimationFrame(() => {
      skipSaveRef.current = false;
    });
  };

  useEffect(() => {
    skipSaveRef.current = true;
    const target = presets[activePreset];
    setPreviewUrl(target?.previewUrl || "");
    setPreviewOwner(activePreset);
    const id = requestAnimationFrame(() => {
      skipSaveRef.current = false;
    });
    return () => cancelAnimationFrame(id);
  }, [activePreset, presets]);

  // Restore saved state after returning from login
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const snapRaw = sessionStorage.getItem(STORAGE_PREVIEW_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      const previewSnap = snapRaw ? JSON.parse(snapRaw) : null;

      if (parsed?.activeTab) setActiveTab(parsed.activeTab);
      if (parsed?.activeGroup) setActiveGroup(parsed.activeGroup);
      if (parsed?.selected) setSelected(parsed.selected);
      if (Array.isArray(parsed?.presets)) setPresets(parsed.presets);
      if (typeof parsed?.userImage === "string" || parsed?.userImage === null) setUserImage(parsed.userImage);
      if (typeof parsed?.originalUpload === "string" || parsed?.originalUpload === null) setOriginalUpload(parsed.originalUpload);
      if (typeof parsed?.backgroundPreview === "string" || parsed?.backgroundPreview === null) setBackgroundPreview(parsed.backgroundPreview);

      const restoredPreset = typeof parsed?.activePreset === "number" ? parsed.activePreset : 0;
      setActivePreset(restoredPreset);

      const owner = typeof parsed?.previewOwner === "number" ? parsed.previewOwner : restoredPreset;
      setPreviewOwner(owner);

      const bestPreview =
        (Array.isArray(parsed?.presets) && parsed.presets[owner]?.previewUrl) ||
        (typeof parsed?.previewUrl === "string" && parsed.previewUrl) ||
        (Array.isArray(parsed?.presets) && parsed.presets[restoredPreset]?.previewUrl) ||
        null;

      const previewToUse = previewSnap?.url || bestPreview;
      const ownerToUse = typeof previewSnap?.owner === "number" ? previewSnap.owner : owner;

      if (previewToUse) {
        setPreviewUrl(previewToUse);
        restoredPreviewRef.current = previewToUse;
        setPreviewOwner(ownerToUse);
        setPresets((prev) => prev.map((p, idx) => (idx === ownerToUse ? { ...p, previewUrl: previewToUse || p.previewUrl } : p)));
      }

      if (parsed?.viewMode === "summary" || parsed?.viewMode === "config") setViewMode(parsed.viewMode);
    } catch {
      // ignore bad cache
    }
    hydratedRef.current = true;
  }, []);

  useEffect(() => {
    // If we restored a preview but lost it during hydration, reapply it
    if (!previewUrl && restoredPreviewRef.current) {
      setPreviewUrl(restoredPreviewRef.current);
      setPresets((prev) => prev.map((p, idx) => (idx === activePreset ? { ...p, previewUrl: restoredPreviewRef.current ?? p.previewUrl } : p)));
    }
  }, [previewUrl, activePreset]);

  useEffect(() => {
    // If previewUrl is empty but current preset has a stored preview, use it
    const candidate = presets?.[activePreset]?.previewUrl;
    if (!previewUrl && candidate) {
      setPreviewUrl(candidate);
      setPreviewOwner(activePreset);
    }
  }, [previewUrl, presets, activePreset]);

  // If redirected back from login with ?view=summary keep summary view open
  useEffect(() => {
    const view = searchParams?.get("view");
    if (view === "summary") {
      setViewMode("summary");
    }
  }, [searchParams]);

  // Persist state so it survives auth redirects
  useEffect(() => {
    const payload = {
      activeTab,
      activeGroup,
      selected,
      presets,
      previewUrl,
      previewOwner,
      userImage,
      originalUpload,
      backgroundPreview,
      activePreset,
      viewMode,
    };
    if (hydratedRef.current) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch {
        // ignore quota errors
      }
      try {
        sessionStorage.setItem(STORAGE_PREVIEW_KEY, JSON.stringify({ url: previewUrl, owner: previewOwner }));
      } catch {
        // ignore
      }
    }
  }, [activeTab, activeGroup, selected, presets, previewUrl, previewOwner, userImage, originalUpload, backgroundPreview, activePreset, viewMode]);

  const generatePreview = async () => {
    if (loading) return;
    if (!userImage) {
      setShowAlert(true);
      return;
    }
    const requestPreset = activePreset;
    const selectionSnapshot = cloneSelections(selected);
    setLoading(true);
    setViewMode("config");
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

  const summaryItems = useMemo(() => {
    const orderMap = Object.fromEntries(categoryOrder.map((cat, idx) => [cat, idx]));
    return (Object.entries(selected) as [WearCategory, Record<string, ConfigOption>][]).sort((a, b) => (orderMap[a[0]] ?? 999) - (orderMap[b[0]] ?? 999));
  }, [selected]);

  if (viewMode === "summary") {
    return (
      <SummaryView
        previewUrl={previewUrl}
        backgroundPreview={backgroundPreview}
        originalUpload={originalUpload}
        summaryItems={summaryItems}
        onEdit={() => setViewMode("config")}
        onSelectOption={(cat, groupKey) => {
          setViewMode("config");
          setActiveTab(cat);
          setActiveGroup((prev) => ({
            ...prev,
            [cat]: groupKey && groupKey !== "default" ? groupKey : null,
          }));
        }}
      />
    );
  }

  return (
    <section className="h-[calc(100dvh-4rem)] max-h-[calc(100dvh-4rem)] lg:h-[calc(100dvh-5rem)] lg:max-h-[calc(100dvh-5rem)] flex flex-col xl:flex-row relative">
      <PreviewPane
        previewUrl={previewUrl}
        loading={loading}
        uploadProcessing={uploadProcessing}
        presets={presets}
        activePreset={activePreset}
        onPresetClick={handleApplyPreset}
        presetOpen={presetOpen}
        togglePreset={() => setPresetOpen((open) => !open)}
      />

      <div className="relative flex flex-col xl:grow min-w-0 bg-white">
        <div className="relative flex flex-col h-[calc(100%-4rem)] xl:h-[calc(100%-5rem)] items-center">
          <TabStrip
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            activeGroup={activeGroup}
            setActiveGroup={setActiveGroup}
            getGroups={getGroups}
            tabScrollRef={tabScrollRef}
            isDraggingRef={isDraggingRef}
            dragPosRef={dragPosRef}
          />

          {activeTab === "사진 업로드" ? (
            <UploadPanel originalUpload={originalUpload} uploadProcessing={uploadProcessing} handleUpload={handleUpload} />
          ) : (
            <OptionsPanel
              catalog={catalog}
              activeTab={activeTab as WearCategory}
              activeGroup={activeGroup}
              setActiveGroup={setActiveGroup}
              getGroups={getGroups}
              getSelectedOption={getSelectedOption}
              handleSelect={handleSelect}
              setSelected={setSelected}
            />
          )}
        </div>

        <div className="flex items-center w-full">
          <button
            className={`flex items-center justify-center w-1/2 h-16 xl:h-20 text-black transition ${
              loading ? "bg-neutral-200 cursor-not-allowed opacity-70" : "bg-neutral-300 hover:bg-neutral-400"
            }`}
            onClick={() => {
              if (!userImage) {
                setShowAlert(true);
                return;
              }
              generatePreview();
            }}
            disabled={loading}
            aria-busy={loading}
          >
            AI 합성
          </button>
          <button
            className={`flex items-center justify-center w-1/2 h-16 xl:h-20 text-white transition ${
              loading ? "bg-neutral-600 cursor-not-allowed opacity-70" : "bg-neutral-700 hover:bg-neutral-800"
            }`}
            onClick={() => {
              if (!userImage) {
                setShowAlert(true);
                return;
              }
              setViewMode("summary");
            }}
            disabled={loading}
          >
            컨시어지 문의
          </button>
        </div>
        {error && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      </div>
      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>전신 사진이 필요합니다</AlertDialogTitle>
            <AlertDialogDescription>AI 합성과 컨시어지 문의를 위해 전신 사진을 먼저 업로드해 주세요.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>닫기</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
