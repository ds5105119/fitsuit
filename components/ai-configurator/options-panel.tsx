"use client";

import NextImage from "next/image";
import { cn } from "@/lib/utils";
import type { ConfigOption, SelectionState, WearCategory } from "./types";
import type { Dispatch, SetStateAction } from "react";

type OptionsPanelProps = {
  catalog: Record<WearCategory, ConfigOption[]>;
  activeTab: WearCategory;
  activeGroup: Partial<Record<WearCategory, string | null>>;
  setActiveGroup: (updater: (prev: Partial<Record<WearCategory, string | null>>) => Partial<Record<WearCategory, string | null>>) => void;
  getGroups: (category: WearCategory) => string[];
  getSelectedOption: (category: WearCategory, group?: string) => ConfigOption | undefined;
  handleSelect: (category: WearCategory, groupKey: string, option: ConfigOption) => void;
  setSelected: Dispatch<SetStateAction<SelectionState>>;
};

export function OptionsPanel({ catalog, activeTab, activeGroup, setActiveGroup, getGroups, getSelectedOption, handleSelect, setSelected }: OptionsPanelProps) {
  const cat = activeTab;
  const groups = getGroups(cat);
  const hasGroups = groups.length > 0;

  if (hasGroups && !activeGroup[cat]) {
    return (
      <div className="flex flex-col w-full h-36 xl:h-[calc(100%-5rem)] px-6 gap-3 overflow-y-auto pt-2 pb-6">
        {groups.map((group) => {
          const current = getSelectedOption(cat, group);
          return (
            <button
              key={group}
              onClick={() => setActiveGroup((prev) => ({ ...prev, [cat]: group }))}
              className="flex w-full items-center text-left gap-4 p-3 rounded-md group"
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
    <div className="flex flex-col w-full h-36 xl:h-[calc(100%-5rem)]">
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
                  className={cn("flex w-full items-center text-left gap-4 p-3 rounded-md group", isActive && "bg-black/10")}
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
}
