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

type AddressFields = {
  postalCode: string;
  roadAddress: string;
  detailAddress: string;
};

const stripNonDigits = (value: string) => value.replace(/\D/g, "");

const formatPhoneNumber = (value: string) => {
  const digits = stripNonDigits(value);
  if (!digits) return "";

  if (digits.startsWith("02")) {
    const limited = digits.slice(0, 10);
    if (limited.length <= 2) return limited;
    if (limited.length <= 5) return `${limited.slice(0, 2)}-${limited.slice(2)}`;
    if (limited.length <= 9) return `${limited.slice(0, 2)}-${limited.slice(2, 5)}-${limited.slice(5)}`;
    return `${limited.slice(0, 2)}-${limited.slice(2, 6)}-${limited.slice(6)}`;
  }

  const limited = digits.slice(0, 11);
  if (limited.length <= 3) return limited;
  if (limited.length <= 7) return `${limited.slice(0, 3)}-${limited.slice(3)}`;
  if (limited.length <= 10) return `${limited.slice(0, 3)}-${limited.slice(3, 6)}-${limited.slice(6)}`;
  return `${limited.slice(0, 3)}-${limited.slice(3, 7)}-${limited.slice(7)}`;
};

const formatBirthDate = (value: string) => {
  const digits = stripNonDigits(value).slice(0, 8);
  if (digits.length <= 4) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 4)}.${digits.slice(4)}`;
  return `${digits.slice(0, 4)}.${digits.slice(4, 6)}.${digits.slice(6)}`;
};

const normalizeBirthDatePayload = (value: string) => {
  const digits = stripNonDigits(value);
  if (!digits) return "";
  if (digits.length !== 8) return value.trim();
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
};

const parseAddress = (raw: string): AddressFields => {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { postalCode: "", roadAddress: "", detailAddress: "" };
  }

  const [line1, ...rest] = trimmed.split("\n");
  const detailAddress = rest.join(" ").trim();
  const line1Trimmed = line1.trim();
  const match = line1Trimmed.match(/^\(?(\d{5})\)?\s*(.*)$/);

  if (!match) {
    return { postalCode: "", roadAddress: line1Trimmed, detailAddress };
  }

  return {
    postalCode: match[1],
    roadAddress: match[2].trim(),
    detailAddress,
  };
};

const formatAddress = ({ postalCode, roadAddress, detailAddress }: AddressFields) => {
  const line1 = [postalCode ? `(${postalCode})` : "", roadAddress].filter(Boolean).join(" ").trim();
  const line2 = detailAddress.trim();
  return [line1, line2].filter(Boolean).join("\n").trim();
};

export function MyPageModifyForm({ email, initialProfile }: { email: string; initialProfile: ProfileFormValues }) {
  const router = useRouter();
  const daumOpen = useDaumPostcodePopup();
  const normalizedProfile = {
    ...initialProfile,
    phone: formatPhoneNumber(initialProfile.phone),
    birthDate: formatBirthDate(initialProfile.birthDate),
  };
  const initialAddress = parseAddress(initialProfile.address);
  const [formValues, setFormValues] = useState<ProfileFormValues>(normalizedProfile);
  const [postalCode, setPostalCode] = useState(initialAddress.postalCode);
  const [roadAddress, setRoadAddress] = useState(initialAddress.roadAddress);
  const [detailAddress, setDetailAddress] = useState(initialAddress.detailAddress);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleComplete = (data: Address) => {
    setPostalCode(data.zonecode || "");
    setRoadAddress(data.roadAddress || "");
    setDetailAddress("");
  };

  const handleClick = () => {
    daumOpen({ onComplete: handleComplete });
  };

  const handleChange = (field: keyof ProfileFormValues) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { value } = event.target;
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhoneChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormValues((prev) => ({ ...prev, phone: formatPhoneNumber(event.target.value) }));
  };

  const handleBirthDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormValues((prev) => ({ ...prev, birthDate: formatBirthDate(event.target.value) }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) return;

    setSaving(true);
    try {
      const address = formatAddress({ postalCode, roadAddress, detailAddress });
      const phone = stripNonDigits(formValues.phone);
      const birthDate = normalizeBirthDatePayload(formValues.birthDate);
      const res = await fetch("/api/mypage/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formValues, phone, birthDate, address }),
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
          <div className="flex flex-col gap-4">
            <label className="flex flex-col lg:flex-row lg:items-center gap-2 text-sm">
              <span className="font-semibold text-neutral-600 w-24 shrink-0">이름</span>
              <input
                value={formValues.userName}
                onChange={handleChange("userName")}
                placeholder="홍길동"
                className="h-10 w-full lg:w-72 rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-900 outline-none focus:border-neutral-400"
              />
            </label>

            <hr className="border-neutral-200" />

            <label className="flex flex-col lg:flex-row lg:items-center gap-2 text-sm">
              <span className="font-semibold text-neutral-600 w-24 shrink-0">이메일</span>
              <input
                value={email}
                readOnly
                className="h-10 w-full lg:w-fit cursor-not-allowed rounded-md border border-neutral-200 bg-neutral-100 px-3 text-sm text-neutral-500 focus:ring-0 focus:outline-0"
              />
            </label>

            <hr className="border-neutral-200" />

            <label className="flex flex-col lg:flex-row lg:items-center gap-2 text-sm">
              <span className="font-semibold text-neutral-600 w-24 shrink-0">휴대폰 번호</span>
              <input
                value={formValues.phone}
                onChange={handlePhoneChange}
                placeholder="010-0000-0000"
                inputMode="numeric"
                className="h-10 w-full lg:w-72 rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-900 outline-none focus:border-neutral-400"
              />
            </label>

            <hr className="border-neutral-200" />

            <label className="flex flex-col lg:flex-row lg:items-center gap-2 text-sm">
              <span className="font-semibold text-neutral-600 w-24 shrink-0">주소</span>
              <div className="flex flex-col space-y-2 w-full">
                <div className="w-full flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={handleClick}
                    className="h-10 w-28 shrink-0 rounded-md border border-neutral-300 bg-white text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
                  >
                    우편번호 찾기
                  </button>
                  <input
                    value={postalCode}
                    readOnly
                    placeholder="우편번호"
                    className="h-10 w-full lg:w-64 cursor-not-allowed rounded-md border border-neutral-200 bg-neutral-100 px-3 text-sm text-neutral-500 focus:ring-0 focus:outline-0"
                  />
                </div>
                <input
                  value={roadAddress}
                  readOnly
                  placeholder="도로명 주소"
                  className="h-10 w-full cursor-not-allowed rounded-md border border-neutral-200 bg-neutral-100 px-3 text-sm text-neutral-500 focus:ring-0 focus:outline-0"
                />
                <input
                  value={detailAddress}
                  onChange={(event) => setDetailAddress(event.target.value)}
                  placeholder="상세주소 입력"
                  className="h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-900 outline-none focus:border-neutral-400"
                />
              </div>
            </label>

            <hr className="border-neutral-200" />

            <label className="flex flex-col lg:flex-row lg:items-center gap-2 text-sm">
              <span className="font-semibold text-neutral-600 w-24 shrink-0">생년월일</span>
              <input
                value={formValues.birthDate}
                onChange={handleBirthDateChange}
                placeholder="2001.02.06"
                inputMode="numeric"
                className="h-10 w-full lg:w-fit rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-900 outline-none focus:border-neutral-400"
              />
            </label>

            <hr className="border-neutral-200" />

            <label className="flex flex-col lg:flex-row lg:items-center gap-2 text-sm">
              <span className="font-semibold text-neutral-600 w-24 shrink-0">성별</span>
              <select
                value={formValues.gender}
                onChange={handleChange("gender")}
                className="h-10 w-full lg:w-fit rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-900 outline-none focus:border-neutral-400"
              >
                <option value="">선택 안 함</option>
                <option value="남성">남성</option>
                <option value="여성">여성</option>
                <option value="기타">기타</option>
              </select>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div />

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="text-sm text-neutral-500 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleting ? "처리 중..." : "회원 탈퇴"}
          </button>
        </div>

        <div className="flex items-center justify-center">
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-sky-500 px-12 py-3 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "저장 중..." : "저장"}
          </button>
        </div>
      </form>
    </div>
  );
}
