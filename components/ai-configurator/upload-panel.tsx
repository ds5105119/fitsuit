"use client";

import NextImage from "next/image";
import { ChangeEvent } from "react";

type UploadPanelProps = {
  originalUpload: string | null;
  uploadProcessing: boolean;
  handleUpload: (e: ChangeEvent<HTMLInputElement>) => void;
};

export function UploadPanel({ originalUpload, uploadProcessing, handleUpload }: UploadPanelProps) {
  return (
    <div className="xl:grow w-full flex flex-col gap-3">
      <div className="hidden xl:block relative w-full h-full overflow-hidden">
        <div className="relative h-full overflow-hidden">
          {originalUpload ? (
            <NextImage alt="업로드한 전신 사진" src={originalUpload} fill className="object-contain" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-neutral-500">전신 사진을 업로드하면 바로 프리뷰를 볼 수 있습니다.</div>
          )}
        </div>
      </div>

      <input id="user-image-input" type="file" accept="image/*" onChange={handleUpload} className="hidden" />

      <label
        htmlFor="user-image-input"
        className="mt-auto flex shrink-0 items-center justify-center w-full h-16 xl:h-20 bg-neutral-900 text-white font-medium cursor-pointer hover:bg-neutral-800 transition-colors"
      >
        {uploadProcessing ? "업로드 처리 중..." : "전신 사진 업로드하기"}
      </label>
    </div>
  );
}
