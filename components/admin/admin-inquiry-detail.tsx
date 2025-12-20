"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Inquiry = {
  id: string;
  createdAt: string;
  orderId: string | null;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  attachmentUrl: string | null;
  replyMessage: string | null;
  replyUpdatedAt: string | null;
};

type State =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; inquiry: Inquiry };

export function AdminInquiryDetail({ inquiryId }: { inquiryId: string }) {
  const router = useRouter();
  const [state, setState] = useState<State>({ status: "loading" });
  const [replyInput, setReplyInput] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/admin/inquiries/${inquiryId}`, { cache: "no-store" });
      if (res.status === 401) {
        router.replace("/admin/login");
        return;
      }
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setState({ status: "error", message: data?.error || "불러오기에 실패했습니다." });
        return;
      }
      setState({ status: "ready", inquiry: data.inquiry });
      setReplyInput(data.inquiry?.replyMessage ?? "");
    };
    load();
  }, [inquiryId, router]);

  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat("ko-KR", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    []
  );

  const saveReply = async () => {
    if (state.status !== "ready" || saving) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/inquiries/${inquiryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyMessage: replyInput }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        toast.error(data?.error || "답변 저장에 실패했습니다.");
        return;
      }
      toast.success("답변이 저장되었습니다.");
      setState({ status: "ready", inquiry: data.inquiry });
      setReplyInput(data.inquiry?.replyMessage ?? "");
    } catch (error) {
      toast.error("답변 저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  if (state.status === "loading") {
    return <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-sm text-neutral-500">로딩 중...</div>;
  }

  if (state.status === "error") {
    return <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{state.message}</div>;
  }

  const { inquiry } = state;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-neutral-500">INQUIRY</p>
          <h1 className="text-2xl font-bold text-neutral-900">문의 상세</h1>
          <p className="text-sm text-neutral-500">
            {formatter.format(new Date(inquiry.createdAt))} · {inquiry.id.slice(0, 8).toUpperCase()}
          </p>
        </div>
        <Link
          href="/admin/inquiries"
          className="rounded-full border border-neutral-300 px-4 py-2 text-sm text-neutral-800 hover:bg-neutral-100"
        >
          ← 목록
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
          <div className="border-b border-neutral-200 px-4 py-3">
            <p className="text-sm font-semibold text-neutral-900">문의 내용</p>
            <p className="text-xs text-neutral-500">고객이 남긴 문의입니다.</p>
          </div>
          <div className="space-y-4 px-4 py-4 text-sm text-neutral-800">
            <div className="rounded-lg bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
              {inquiry.message}
            </div>
            {inquiry.attachmentUrl && (
              <a
                href={inquiry.attachmentUrl}
                className="text-sm text-neutral-900 underline underline-offset-4"
                target="_blank"
                rel="noreferrer"
              >
                첨부 파일 보기
              </a>
            )}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
          <div className="border-b border-neutral-200 px-4 py-3">
            <p className="text-sm font-semibold text-neutral-900">고객 정보</p>
            <p className="text-xs text-neutral-500">연락 가능한 정보</p>
          </div>
          <div className="px-4 py-4 text-sm text-neutral-700 space-y-2">
            <div className="flex justify-between">
              <span className="text-neutral-500">이름</span>
              <span className="font-semibold">{inquiry.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">이메일</span>
              <span className="font-semibold">{inquiry.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">연락처</span>
              <span className="font-semibold">{inquiry.phone || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">주문</span>
              {inquiry.orderId ? (
                <Link href={`/admin/orders/${inquiry.orderId}`} className="font-semibold text-sky-600 hover:underline">
                  {inquiry.orderId.slice(0, 8).toUpperCase()}
                </Link>
              ) : (
                <span className="font-semibold">-</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <div className="border-b border-neutral-200 px-4 py-3">
          <p className="text-sm font-semibold text-neutral-900">관리자 답변</p>
          <p className="text-xs text-neutral-500">답변을 저장하면 고객에게 표시됩니다.</p>
        </div>
        <div className="space-y-3 px-4 py-4">
          <textarea
            rows={5}
            value={replyInput}
            onChange={(event) => setReplyInput(event.target.value)}
            placeholder="답변 내용을 입력하세요."
            className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none ring-neutral-200 focus:border-neutral-400 focus:ring-2"
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-neutral-500">
              {inquiry.replyUpdatedAt
                ? `마지막 수정: ${formatter.format(new Date(inquiry.replyUpdatedAt))}`
                : "아직 답변이 없습니다."}
            </p>
            <button
              type="button"
              onClick={saveReply}
              disabled={saving}
              className="rounded-md bg-sky-500 px-6 py-2 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "저장 중..." : "답변 저장"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
