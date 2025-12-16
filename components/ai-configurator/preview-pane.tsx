"use client";

import NextImage from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Preset } from "./types";
import { cn } from "@/lib/utils";

type PreviewPaneProps = {
  previewUrl: string;
  loading: boolean;
  uploadProcessing: boolean;
  presets: Preset[];
  activePreset: number;
  onPresetClick: (idx: number) => void;
  presetOpen: boolean;
  togglePreset: () => void;
};

export function PreviewPane({
  previewUrl,
  loading,
  uploadProcessing,
  presets,
  activePreset,
  onPresetClick,
  presetOpen,
  togglePreset,
}: PreviewPaneProps) {
  return (
    <div className="relative h-full">
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

      <div className="absolute left-4 bottom-4 z-20 flex flex-col-reverse items-start gap-3">
        <button
          type="button"
          onClick={togglePreset}
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
                    onClick={() => onPresetClick(idx)}
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
    </div>
  );
}
