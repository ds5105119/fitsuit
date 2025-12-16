"use client";

import { MutableRefObject } from "react";
import { cn } from "@/lib/utils";
import type { CategoryKey, WearCategory } from "./types";

type TabStripProps = {
  tabs: CategoryKey[];
  activeTab: CategoryKey;
  setActiveTab: (tab: CategoryKey) => void;
  activeGroup: Partial<Record<WearCategory, string | null>>;
  setActiveGroup: (updater: (prev: Partial<Record<WearCategory, string | null>>) => Partial<Record<WearCategory, string | null>>) => void;
  getGroups: (category: WearCategory) => string[];
  tabScrollRef: MutableRefObject<HTMLDivElement | null>;
  isDraggingRef: MutableRefObject<boolean>;
  dragPosRef: MutableRefObject<{ x: number; scroll: number }>;
};

export function TabStrip({ tabs, activeTab, setActiveTab, activeGroup, setActiveGroup, getGroups, tabScrollRef, isDraggingRef, dragPosRef }: TabStripProps) {
  const cat = activeTab as WearCategory;
  const groups = getGroups(cat);
  const hasGroups = groups.length > 0;

  if (activeTab !== "사진 업로드" && hasGroups && activeGroup[cat]) {
    return (
      <div className="flex items-center gap-2">
        <button onClick={() => setActiveGroup((prev) => ({ ...prev, [cat]: null }))} className="h-16 xl:h-20 font-semibold text-neutral-600 hover:text-neutral-900">
          ← 목록으로
        </button>
        <span className="text-xs text-neutral-500">{activeGroup[cat]}</span>
      </div>
    );
  }

  return (
    <div
      ref={tabScrollRef}
      className="px-4 xl:px-6 h-16 xl:h-20 items-center w-full flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide"
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
            "rounded-full px-4 py-2 font-medium text-sm xl:text-base transition select-none",
            activeTab === tab ? "border-black bg-black text-white shadow-[0_10px_30px_-18px_rgba(0,0,0,0.6)]" : ""
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
