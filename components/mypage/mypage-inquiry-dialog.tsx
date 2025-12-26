"use client";

import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { INQUIRY_CATEGORIES } from "@/lib/inquiry";
import { cn } from "@/lib/utils";
import { XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { DialogClose } from "@radix-ui/react-dialog";

type OrderSummary = {
  id: string;
};

type AttachmentItem = {
  id: string;
  file: File;
  previewUrl: string;
};

const MAX_ATTACHMENTS = 10;
const MAX_ATTACHMENT_BYTES = 8_000_000;

function buildAttachmentId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function MyPageInquiryDialog({
  phone,
  order,
  orderError,
  triggerLabel,
  triggerClassName,
  defaultOpen = false,
}: {
  phone: string;
  order: OrderSummary | null;
  orderError: boolean;
  triggerLabel: string;
  triggerClassName?: string;
  defaultOpen?: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(defaultOpen);
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("");
  const [saving, setSaving] = useState(false);
  const [attachments, setAttachments] = useState<AttachmentItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const attachmentsRef = useRef<AttachmentItem[]>([]);

  const remainingCount = MAX_ATTACHMENTS - attachments.length;

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;

    isDragging.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;

    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.2; // 스크롤 감도
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const onMouseUp = () => {
    isDragging.current = false;
  };

  const orderLabel = useMemo(() => {
    if (!order) return "";
    return order.id.slice(0, 8).toUpperCase();
  }, [order]);

  useEffect(() => {
    attachmentsRef.current = attachments;
  }, [attachments]);

  useEffect(() => {
    return () => {
      attachmentsRef.current.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };
  }, []);

  const clearAttachments = () => {
    attachments.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    setAttachments([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFilesSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    if (files.length === 0) return;

    if (remainingCount <= 0) {
      toast.error("사진은 최대 10장까지 첨부할 수 있습니다.");
      event.target.value = "";
      return;
    }

    const nextFiles = files.slice(0, remainingCount);
    if (files.length > remainingCount) {
      toast.error("최대 10장까지만 첨부됩니다.");
    }

    const nextItems: AttachmentItem[] = [];

    for (const file of nextFiles) {
      if (!file.type.startsWith("image/")) {
        toast.error("이미지 파일만 업로드할 수 있습니다.");
        continue;
      }
      if (file.size > MAX_ATTACHMENT_BYTES) {
        toast.error("이미지 파일은 8MB 이하여야 합니다.");
        continue;
      }
      nextItems.push({
        id: buildAttachmentId(),
        file,
        previewUrl: URL.createObjectURL(file),
      });
    }

    if (nextItems.length > 0) {
      setAttachments((prev) => [...prev, ...nextItems]);
    }

    event.target.value = "";
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) return;

    const trimmedCategory = category.trim();
    if (!trimmedCategory) {
      toast.error("문의 종류를 선택해 주세요.");
      return;
    }

    const trimmed = message.trim();
    if (!trimmed) {
      toast.error("문의 내용을 입력해 주세요.");
      return;
    }

    if (attachments.length > MAX_ATTACHMENTS) {
      toast.error("사진은 최대 10장까지 첨부할 수 있습니다.");
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.set("message", trimmed);
      formData.set("category", trimmedCategory);
      formData.set("phone", phone.trim());
      if (order?.id) {
        formData.set("orderId", order.id);
      }
      attachments.forEach((item) => {
        formData.append("attachments", item.file);
      });

      const res = await fetch("/api/mypage/inquiries", {
        method: "POST",
        body: formData,
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        toast.error(data?.error || "문의 접수에 실패했습니다.");
        return;
      }
      toast.success("문의가 접수되었습니다.");
      setMessage("");
      setCategory("");
      clearAttachments();
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error("문의 접수 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button type="button" className={triggerClassName}>
          {triggerLabel}
        </button>
      </DialogTrigger>
      <DialogContent
        showClose={false}
        className="rounded-none min-w-full h-full lg:min-w-2xl lg:h-fit lg:max-w-2xl lg:rounded-2xl overflow-y-auto p-0 border-none"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>문의 작성</DialogTitle>
          <DialogDescription>문의 내용을 입력해 주세요.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="p-4 lg:p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">문의 작성</p>
              </div>
              {order ? (
                <span className="rounded-md bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-600">주문 문의 · {orderLabel}</span>
              ) : (
                <span className="rounded-md bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-500">일반 문의</span>
              )}
            </div>

            {orderError && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                유효하지 않은 주문입니다. 주문 연결 없이 문의가 접수됩니다.
              </div>
            )}

            <div className="space-y-2">
              <p className="text-sm font-semibold text-neutral-800">카테고리</p>
              <div className="grid gap-2 grid-cols-3">
                {INQUIRY_CATEGORIES.map((item) => {
                  const selected = category === item;
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setCategory(item)}
                      className={cn(
                        "rounded-sm border py-3.5 text-xs lg:text-sm font-semibold transition",
                        selected
                          ? "border-neutral-900 bg-neutral-900/5 text-neutral-900"
                          : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400"
                      )}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-neutral-800">내용</p>
              <textarea
                rows={7}
                name="message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder={`접수된 문의는 순차적으로 답변해 드립니다.\n정확한 답변을 위해 문의 내용을 상세히 작성해 주세요.\n운영시간: 오전 9시 ~ 오후 6시 (평일)`}
                className="w-full rounded-sm border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 outline-none resize-none"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-neutral-800">사진</span>
                <span className="text-xs text-neutral-500">
                  {attachments.length}/{MAX_ATTACHMENTS}
                </span>
              </div>
              <div
                ref={scrollRef}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp}
                className="flex gap-3 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing select-none"
              >
                {attachments.map((item) => (
                  <div
                    key={item.id}
                    className="min-w-1/3 max-w-1/3 lg:min-w-1/5 lg:max-w-1/5 select-none relative aspect-square overflow-hidden rounded-sm border border-neutral-200 bg-neutral-50"
                  >
                    <img src={item.previewUrl} alt="문의 첨부 이미지" className="h-full w-full object-cover select-none" loading="lazy" />
                    <button
                      type="button"
                      onClick={() => removeAttachment(item.id)}
                      className="absolute size-5 right-2 top-2 flex items-center justify-center rounded-full bg-neutral-900 text-white"
                    >
                      <XIcon className="size-3.5" strokeWidth={3} />
                    </button>
                  </div>
                ))}
                {attachments.length < MAX_ATTACHMENTS && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="min-w-1/3 max-w-1/3 lg:min-w-1/5 lg:max-w-1/5 flex aspect-square items-center justify-center rounded-sm border border-dashed border-neutral-300 bg-neutral-50 text-2xl text-neutral-400 transition hover:border-neutral-400"
                  >
                    +
                  </button>
                )}
              </div>
              <input ref={fileInputRef} type="file" name="attachments" accept="image/*" multiple onChange={handleFilesSelected} className="hidden" />
              <p className="text-xs text-neutral-500">이미지 파일만 업로드 가능 (장당 최대 8MB)</p>
            </div>
          </div>

          <div className="flex items-center absolute bottom-0 w-full">
            <DialogClose asChild>
              <button type="button" className="w-1/2 h-14 lg:h-16 bg-neutral-400 text-white font-bold">
                취소
              </button>
            </DialogClose>
            <button type="submit" disabled={saving} className="w-1/2 h-14 lg:h-16 bg-neutral-700 text-white font-bold">
              {saving ? "접수 중..." : "문의하기"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
