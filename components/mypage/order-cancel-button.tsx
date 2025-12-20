"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  orderId: string;
  status: string;
  className?: string;
};

export function OrderCancelButton({ orderId, status, className }: Props) {
  const [loading, setLoading] = useState(false);

  if (status === "취소" || status === "완료") {
    return null;
  }

  const cancel = async () => {
    if (loading) return;

    const ok = window.confirm("정말 주문을 취소하시겠습니까?");
    if (!ok) return;

    setLoading(true);

    const res = await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "취소" }),
    });

    const data = await res.json().catch(() => null);

    setLoading(false);

    if (!res.ok) {
      toast.error(data?.error || "취소에 실패했습니다.");
      return;
    }

    toast.success("주문이 취소되었습니다.");
    window.location.reload();
  };

  return (
    <button onClick={cancel} disabled={loading} className={cn(className)}>
      {loading ? "취소 중..." : "주문 취소"}
    </button>
  );
}
