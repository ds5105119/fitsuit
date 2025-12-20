"use client";

import { type FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type OrderSummary = {
  id: string;
};

export function MyPageContactForm({
  email,
  userName,
  phone,
  order,
  orderError,
  onSubmitted,
}: {
  email: string;
  userName: string;
  phone: string;
  order: OrderSummary | null;
  orderError: boolean;
  onSubmitted?: () => void;
}) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const orderLabel = useMemo(() => {
    if (!order) return "";
    return order.id.slice(0, 8).toUpperCase();
  }, [order]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) return;

    const trimmed = message.trim();
    if (!trimmed) {
      toast.error("문의 내용을 입력해 주세요.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/mypage/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          phone: phone.trim(),
          orderId: order?.id ?? null,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        toast.error(data?.error || "문의 접수에 실패했습니다.");
        return;
      }
      toast.success("문의가 접수되었습니다.");
      setMessage("");
      onSubmitted?.();
      router.refresh();
    } catch (error) {
      toast.error("문의 접수 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">문의 작성</p>
        </div>
        {order ? (
          <span className="rounded-md bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-600">주문 문의</span>
        ) : (
          <span className="rounded-md bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-500">일반 문의</span>
        )}
      </div>

      {orderError && (
        <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
          유효하지 않은 주문입니다. 주문 연결 없이 문의가 접수됩니다.
        </div>
      )}

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="hidden">
          <input value={userName} readOnly className="hidden" />
        </label>
        <label className="hidden">
          <input value={email} readOnly className="hidden" />
        </label>
        {order && (
          <label className="hidden">
            <input value={order.id} readOnly className="hidden" />
          </label>
        )}
        <label className="hidden">
          <input value={phone} className="hidden" />
        </label>

        <label className="flex flex-col gap-2 text-sm md:col-span-2">
          <span className="font-semibold text-neutral-600">문의 내용</span>
          <textarea
            rows={4}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="문의하실 내용을 입력해 주세요."
            className="w-full rounded-xs border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none ring-neutral-200 focus:border-neutral-400 focus:ring-2"
          />
        </label>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div />
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-sky-500 px-6 py-2 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "접수 중..." : "문의하기"}
        </button>
      </div>
    </form>
  );
}
