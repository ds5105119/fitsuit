"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";

export function MyPageInquiryDeleteButton({ inquiryId, className }: { inquiryId: string; className?: string }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (loading) return;
    const ok = window.confirm("문의 내역을 삭제하시겠습니까? 삭제 후 복구할 수 없습니다.");
    if (!ok) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/mypage/inquiries/${inquiryId}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        toast.error(data?.error || "삭제에 실패했습니다.");
        return;
      }
      window.location.reload();
    } catch (error) {
      toast.error("삭제 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button type="button" onClick={handleDelete} disabled={loading} className={cn(className)}>
      {loading ? "삭제 중..." : "삭제"}
    </button>
  );
}
