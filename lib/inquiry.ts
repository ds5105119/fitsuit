export const INQUIRY_CATEGORIES = [
  "배송",
  "주문/결제",
  "취소/교환/환불",
  "회원정보",
  "상품확인",
  "서비스",
  "기타",
] as const;

export type InquiryCategory = (typeof INQUIRY_CATEGORIES)[number];

export const DEFAULT_INQUIRY_CATEGORY: InquiryCategory = "기타";

const CATEGORY_SET = new Set<string>(INQUIRY_CATEGORIES);

export function normalizeInquiryCategory(value: unknown): InquiryCategory | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return CATEGORY_SET.has(trimmed) ? (trimmed as InquiryCategory) : null;
}
