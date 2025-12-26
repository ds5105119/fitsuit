"use client";

import NextImage from "next/image";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useInView } from "framer-motion";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import type { ConfigOption, WearCategory } from "./types";
import { TicketsIcon, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import { LoginDialog } from "@/components/auth/login-dialog";

type SummaryViewProps = {
  previewUrl: string;
  backgroundPreview: string | null;
  originalUpload: string | null;
  summaryItems: [WearCategory, Record<string, ConfigOption>][];
  onEdit: () => void;
  onSelectOption: (cat: WearCategory, groupKey?: string) => void;
};

export function SummaryView({ previewUrl, backgroundPreview, originalUpload, summaryItems, onEdit, onSelectOption }: SummaryViewProps) {
  const router = useRouter();
  const { status } = useSession();
  const hero = previewUrl || backgroundPreview || originalUpload || "";
  const visibleCats: WearCategory[] = ["원단", "재킷", "바지", "셔츠"];
  const filtered = summaryItems.filter(([cat]) => visibleCats.includes(cat));
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
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

  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  // Restore measurements when returning after auth redirect
  useEffect(() => {
    try {
      const raw = localStorage.getItem("ai-configurator-measurements");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        setMeasurements((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      // ignore cache errors
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("ai-configurator-measurements", JSON.stringify(measurements));
    } catch {
      // ignore quota errors
    }
  }, [measurements]);

  const handleMeasurementChange = (key: MeasurementKey, value: string) => {
    setMeasurements((prev) => ({ ...prev, [key]: value }));
  };

  const handleMeasurementSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const submitOrder = async () => {
    if (orderSubmitting) return;
    setOrderSubmitting(true);

    const cleanedMeasurements = Object.fromEntries(
      Object.entries(measurements)
        .map(([k, v]) => [k, v.trim()] as const)
        .filter(([, v]) => Boolean(v))
    );

    const selections = summaryItems.flatMap(([category, groupMap]) =>
      Object.entries(groupMap || {}).map(([groupKey, option]) => ({
        category,
        group: groupKey === "default" ? null : groupKey,
        title: option.title,
        subtitle: option.subtitle,
      }))
    );

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selections,
          measurements: Object.keys(cleanedMeasurements).length ? cleanedMeasurements : null,
          previewUrl: previewUrl || null,
          originalUpload: originalUpload || null,
          backgroundPreview: backgroundPreview || null,
        }),
      });

      if (res.status === 401) {
        toast.error("로그인 후 주문 전송이 가능합니다.");
        setLoginOpen(true);
        return;
      }

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const message = data?.error || "주문 전송에 실패했습니다.";
        toast.error(message);
        return;
      }

      const orderId = data?.order?.id;
      if (typeof orderId === "string") {
        toast.success("주문이 전송되었습니다.");
        try {
          localStorage.removeItem("ai-configurator-state");
          localStorage.removeItem("ai-configurator-measurements");
          sessionStorage.removeItem("ai-configurator-preview-latest");
        } catch {
          // ignore storage errors
        }
        router.push(`/mypage/orders/${orderId}`);
        return;
      }

      toast.success("주문이 전송되었습니다.");
      try {
        localStorage.removeItem("ai-configurator-state");
        localStorage.removeItem("ai-configurator-measurements");
        sessionStorage.removeItem("ai-configurator-preview-latest");
      } catch {
        // ignore storage errors
      }
      router.push("/mypage");
    } catch (e: any) {
      const message = e?.message || "주문 전송 중 오류가 발생했습니다.";
      toast.error(message);
    } finally {
      setOrderSubmitting(false);
    }
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

  const ctaInView = useInView(ctaRef, {
    margin: "0px 0px -100px 0px",
  });

  const handleOrderClick = () => {
    if (status === "authenticated") {
      submitOrder();
    } else {
      setLoginOpen(true);
    }
  };

  return (
    <section className="h-full w-full bg-white">
      <div ref={wrapRef} className="flex h-full w-full flex-col gap-12 lg:gap-16 lg:w-3/4 mx-auto pb-12 lg:pb-16 pt-12 lg:pt-16">
        <div className="flex items-center justify-center px-6">
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

                <SheetContent side="right" className="w-full min-w-full lg:min-w-lg lg:max-w-lg p-0 bg-neutral-100">
                  <SheetHeader className="sr-only">
                    <SheetTitle>신체 사이즈 입력</SheetTitle>
                    <SheetDescription>정확한 맞춤을 위해 치수를 입력해 주세요.</SheetDescription>
                  </SheetHeader>

                  <div className="relative w-full h-full overflow-y-auto">
                    <SheetClose asChild>
                      <button className="bg-white flex items-center justify-center w-6 h-6 shrink-0 rounded-full absolute right-3 top-3">
                        <XIcon className="size-4" />
                      </button>
                    </SheetClose>

                    <div className="flex flex-col h-full space-y-10">
                      <div className="pt-12 flex flex-col space-y-4 items-center">
                        <TicketsIcon className="size-8 text-neutral-900" />
                        <h2 className="text-2xl font-bold text-neutral-900">신체 사이즈 입력</h2>
                      </div>

                      <form className="grow flex flex-col space-y-6" onSubmit={handleMeasurementSubmit}>
                        <div className="grow grid grid-cols-1 gap-2 px-6 lg:px-12">
                          {measurementFields.map((field) => (
                            <label key={field.key} className="flex flex-col gap-1 text-sm font-semibold text-neutral-800">
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

                        <SheetFooter className="sticky bottom-0 h-16 border-t border-t-neutral-300 bg-neutral-100">
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

            <div ref={ctaRef} className="flex flex-col space-y-2">
              <div className="flex space-x-2">
                <div>
                  <p className="text-xs lg:text-sm font-semibold text-neutral-900">Delivery time</p>
                  <p className="text-xs lg:text-sm text-neutral-600">2-3 weeks</p>
                </div>
              </div>
              <Button variant="outline" onClick={onEdit}>
                계속 편집
              </Button>
              <Button onClick={handleOrderClick} disabled={orderSubmitting}>
                {orderSubmitting ? "전송 중..." : "컨시어지 주문 전송"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        initial={false}
        animate={ctaInView ? { y: 96, opacity: 0 } : { y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 320, damping: 32, mass: 0.9 }}
        className="flex fixed bottom-0 h-22 w-full border-t border-t-neutral-300 bg-white"
      >
        <div className="w-full h-full flex items-center justify-between lg:w-3/4 px-6 mx-auto">
          <div className="flex space-x-2">
            <div>
              <p className="text-xs lg:text-sm font-semibold text-neutral-900">Delivery time</p>
              <p className="text-xs lg:text-sm text-neutral-600">2-3 weeks</p>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline">Finish in-store</Button>
            <Button onClick={handleOrderClick} disabled={orderSubmitting}>
              {orderSubmitting ? "전송 중..." : "컨시어지 주문 전송"}
            </Button>
          </div>
        </div>
      </motion.div>
      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} callbackUrl="/ai?view=summary" onCloseHref="" />
    </section>
  );
}
