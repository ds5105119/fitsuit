"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MyPageContactForm } from "./mypage-contact-form";

type OrderSummary = {
  id: string;
};

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
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button type="button" className={triggerClassName}>
          {triggerLabel}
        </button>
      </DialogTrigger>
      <DialogContent showClose={false} className="max-w-2xl rounded-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>문의 작성</DialogTitle>
          <DialogDescription>문의 내용을 입력해 주세요.</DialogDescription>
        </DialogHeader>
        <MyPageContactForm phone={phone} order={order} orderError={orderError} onSubmitted={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
