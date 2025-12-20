"use client";

import { type ChangeEvent, type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { Address, useDaumPostcodePopup } from "react-daum-postcode";

type ProfileFormValues = {
  userName: string;
  phone: string;
  address: string;
  gender: string;
  birthDate: string;
};

export function MyPageModifyForm({ email, initialProfile }: { email: string; initialProfile: ProfileFormValues }) {
  const router = useRouter();
  const daumOpen = useDaumPostcodePopup();
  const [formValues, setFormValues] = useState<ProfileFormValues>(initialProfile);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [fullAddress, setFullAddress] = useState(initialProfile.address);
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");

  const handleComplete = (data: Address) => {
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress += extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }

    console.log(fullAddress); // e.g. '서울 성동구 왕십리로2길 20 (성수동1가)'
  };

  const handleClick = () => {
    daumOpen({ onComplete: handleComplete });
  };

  const handleChange = (field: keyof ProfileFormValues) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { value } = event.target;
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) return;

    setSaving(true);
    try {
      const res = await fetch("/api/mypage/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        toast.error(data?.error || "저장에 실패했습니다.");
        return;
      }
      toast.success("내 정보가 저장되었습니다.");
      router.refresh();
    } catch (error) {
      toast.error("저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (deleting) return;
    const ok = window.confirm("정말 탈퇴하시겠습니까? 보유 주문 내역이 모두 삭제됩니다.");
    if (!ok) return;

    setDeleting(true);
    try {
      const res = await fetch("/api/mypage/profile", { method: "DELETE" });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        toast.error(data?.error || "탈퇴에 실패했습니다.");
        return;
      }
      toast.success("회원 탈퇴가 완료되었습니다.");
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      toast.error("탈퇴 처리 중 오류가 발생했습니다.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-xl border border-neutral-200 p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm">
              <span className="font-semibold text-neutral-600">이름</span>
              <input
                value={formValues.userName}
                onChange={handleChange("userName")}
                placeholder="홍길동"
                className="h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-900 outline-none ring-neutral-200 focus:border-neutral-400 focus:ring-2"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm">
              <span className="font-semibold text-neutral-600">아이디(이메일)</span>
              <input
                value={email}
                readOnly
                className="h-10 w-full cursor-not-allowed rounded-md border border-neutral-200 bg-neutral-100 px-3 text-sm text-neutral-500"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm">
              <span className="font-semibold text-neutral-600">휴대폰 번호</span>
              <input
                value={formValues.phone}
                onChange={handleChange("phone")}
                placeholder="010-0000-0000"
                className="h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-900 outline-none ring-neutral-200 focus:border-neutral-400 focus:ring-2"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm">
              <span className="font-semibold text-neutral-600">생년월일</span>
              <input
                type="date"
                value={formValues.birthDate}
                onChange={handleChange("birthDate")}
                className="h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-900 outline-none ring-neutral-200 focus:border-neutral-400 focus:ring-2"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm">
              <span className="font-semibold text-neutral-600">성별</span>
              <select
                value={formValues.gender}
                onChange={handleChange("gender")}
                className="h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-900 outline-none ring-neutral-200 focus:border-neutral-400 focus:ring-2"
              >
                <option value="">선택 안 함</option>
                <option value="남성">남성</option>
                <option value="여성">여성</option>
                <option value="기타">기타</option>
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm md:col-span-2">
              <span className="font-semibold text-neutral-600">주소</span>
              <textarea
                rows={2}
                value={formValues.address}
                onChange={handleChange("address")}
                placeholder="서울특별시 강남구 ..."
                className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none ring-neutral-200 focus:border-neutral-400 focus:ring-2"
              />
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-blue-50 px-4 py-3">
          <p className="text-xs text-neutral-500">입력하신 정보는 마이페이지 및 주문 관리에 반영됩니다.</p>
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-sky-500 px-6 py-2 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "저장 중..." : "저장"}
          </button>
        </div>
      </form>

      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-red-700">회원 탈퇴</p>
            <p className="text-xs text-red-600">탈퇴 시 주문 내역이 모두 삭제되며 복구할 수 없습니다.</p>
          </div>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-md border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleting ? "처리 중..." : "회원 탈퇴"}
          </button>
        </div>
      </div>
    </div>
  );
}
