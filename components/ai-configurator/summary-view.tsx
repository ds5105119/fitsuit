"use client";

import NextImage from "next/image";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { ConfigOption, WearCategory } from "./types";
import { TicketsIcon, XIcon } from "lucide-react";

type SummaryViewProps = {
  previewUrl: string;
  backgroundPreview: string | null;
  originalUpload: string | null;
  summaryItems: [WearCategory, Record<string, ConfigOption>][];
  onEdit: () => void;
  onSelectOption: (cat: WearCategory, groupKey?: string) => void;
};

export function SummaryView({ previewUrl, backgroundPreview, originalUpload, summaryItems, onEdit, onSelectOption }: SummaryViewProps) {
  const hero = previewUrl || backgroundPreview || originalUpload || "";
  const visibleCats: WearCategory[] = ["원단", "재킷", "바지", "셔츠"];
  const filtered = summaryItems.filter(([cat]) => visibleCats.includes(cat));
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const measurementFields = [
    { key: "height", label: "키", placeholder: "예: 175cm" },
    { key: "weight", label: "체중", placeholder: "예: 68kg" },
    { key: "neck", label: "목", placeholder: "예: 38cm" },
    { key: "chest", label: "가슴", placeholder: "예: 100cm" },
    { key: "belly", label: "배", placeholder: "예: 85cm" },
    { key: "waist", label: "바지 허리", placeholder: "예: 82cm" },
    { key: "hip", label: "볼기", placeholder: "예: 96cm" },
    { key: "thigh", label: "허벅지", placeholder: "예: 56cm" },
  ] as const;
  type MeasurementKey = (typeof measurementFields)[number]["key"];

  const [measurements, setMeasurements] = useState<Record<MeasurementKey, string>>(() =>
    measurementFields.reduce((acc, field) => {
      acc[field.key] = "";
      return acc;
    }, {} as Record<MeasurementKey, string>)
  );

  const filledCount = Object.values(measurements).filter(Boolean).length;

  const handleMeasurementChange = (key: MeasurementKey, value: string) => {
    setMeasurements((prev) => ({ ...prev, [key]: value }));
  };

  const handleMeasurementSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  useEffect(() => {
    const wrap = wrapRef.current;
    const list = listRef.current;
    if (!wrap || !list) return;
    const sync = () => {
      wrap.style.minHeight = `${list.getBoundingClientRect().height}px`;
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(list);
    return () => ro.disconnect();
  }, []);

  return (
    <section className="h-full w-full bg-white">
      <div ref={wrapRef} className="flex h-full w-full flex-col gap-12 lg:gap-16 lg:w-3/4 mx-auto">
        <div className="flex items-center justify-center px-6 pt-12 lg:pt-16">
          <h2 className="text-2xl lg:text-4xl font-bold">맞춤 수트 요약</h2>
        </div>

        <div className="flex flex-col gap-8 xl:gap-24 px-6 lg:flex-row lg:items-start">
          <div className="relative w-full lg:w-2/3 lg:sticky lg:top-24 self-start">
            <div className="relative w-full aspect-square lg:aspect-4/3 overflow-hidden">
              <NextImage alt="맞춤 자켓 프리뷰" src={hero} fill className="object-cover" priority />
            </div>
          </div>

          <div ref={listRef} className="flex flex-col gap-12 grow">
            {filtered.map(([cat, groupMap]) => {
              const entries = Object.entries(groupMap || {});
              if (!entries.length) return null;
              return (
                <div key={cat} className="">
                  <div className="mb-3">
                    <p className="text-lg lg:text-xl font-semibold text-neutral-900">{cat}</p>
                  </div>
                  <div className="space-y-3">
                    {entries.map(([groupKey, option]) => (
                      <button
                        key={groupKey}
                        className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-neutral-200 transition"
                        onClick={() => onSelectOption(cat, groupKey)}
                      >
                        <div className="h-12 w-12 overflow-hidden rounded-md border border-neutral-200 bg-neutral-50" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-neutral-900">{groupKey === "default" ? option.title : groupKey}</p>
                          <p className="text-xs text-neutral-600">{groupKey === "default" ? option.subtitle : option.title}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}

            <div>
              <div className="flex space-x-2 items-center mb-3">
                <TicketsIcon className="size-6 text-blue-500" />
                <p className="text-lg lg:text-xl font-semibold text-neutral-900">사이즈</p>
              </div>
              <Sheet>
                <SheetTrigger asChild>
                  <button className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-neutral-200 transition">
                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-neutral-900 text-xs font-semibold uppercase tracking-tight text-white">
                      Size
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-neutral-900">사이즈 직접 입력</p>
                      <p className="text-xs text-neutral-600">키, 체중, 신체 치수를 입력해 주세요.</p>
                    </div>
                    <div className="text-[11px] text-neutral-500">{filledCount ? `${filledCount}개 입력됨` : "미입력"}</div>
                  </button>
                </SheetTrigger>

                <SheetContent side="right" className="w-full min-w-full lg:min-w-lg lg:max-w-lg p-0 bg-neutral-100" showClose={false}>
                  <SheetHeader className="sr-only">
                    <SheetTitle>신체 사이즈 입력</SheetTitle>
                    <SheetDescription>정확한 맞춤을 위해 치수를 입력해 주세요.</SheetDescription>
                  </SheetHeader>

                  <div className="relative w-full h-full">
                    <SheetClose asChild>
                      <button className="bg-white flex items-center justify-center w-6 h-6 shrink-0 rounded-full absolute right-3 top-3">
                        <XIcon className="size-4" />
                      </button>
                    </SheetClose>

                    <div className="space-y-10">
                      <div className="pt-12 flex flex-col space-y-4 items-center">
                        <TicketsIcon className="size-8 text-neutral-900" />
                        <h2 className="text-2xl font-bold text-neutral-900">신체 사이즈 입력</h2>
                      </div>

                      <form className="space-y-6" onSubmit={handleMeasurementSubmit}>
                        <div className="grid grid-cols-1 gap-2 px-6 lg:px-12">
                          {measurementFields.map((field) => (
                            <label key={field.key} className="flex flex-col gap-2 text-sm font-semibold text-neutral-800">
                              <span>{field.label}</span>
                              <input
                                type="text"
                                value={measurements[field.key]}
                                onChange={(event) => handleMeasurementChange(field.key, event.target.value)}
                                placeholder={field.placeholder}
                                className="rounded-xs border border-neutral-200 px-3 py-2 text-sm font-normal text-neutral-900 placeholder:text-neutral-400"
                              />
                            </label>
                          ))}
                        </div>

                        <SheetFooter className="absolute w-full bottom-0 h-16 border-t border-t-neutral-300">
                          <div className="w-full h-full p-2.5">
                            <SheetClose asChild>
                              <button type="submit" className="w-full h-full bg-neutral-700 text-sm font-semibold text-white hover:bg-neutral-800">
                                저장
                              </button>
                            </SheetClose>
                          </div>
                        </SheetFooter>
                      </form>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 pb-6">
          <button onClick={onEdit} className="rounded-full border px-5 py-3 text-sm font-semibold hover:bg-neutral-50">
            계속 편집
          </button>
          <button className="rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-800">컨시어지 문의 전송</button>
        </div>
      </div>
    </section>
  );
}
