import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getUserProfileByEmail } from "@/lib/db/queries";
import { MyPageModifyForm } from "./mypage-modify-form";

export async function MyPageModify() {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) {
    redirect("/mypage/login?callbackUrl=/mypage/modify");
  }

  const profile = await getUserProfileByEmail(email);
  const initialProfile = {
    userName: profile?.userName ?? session?.user?.name ?? "",
    phone: profile?.phone ?? "",
    address: profile?.address ?? "",
    gender: profile?.gender ?? "",
    birthDate: profile?.birthDate ?? "",
  };

  return (
    <section className="flex-1">
      <div className="w-full flex flex-col space-y-2 lg:flex-row lg:space-y-0 lg:justify-between lg:items-center pb-4">
        <p className="text-lg font-bold">내 정보 수정</p>
        <p className="text-xs text-neutral-500">마이페이지에서 사용할 회원 정보를 관리하세요.</p>
      </div>
      <MyPageModifyForm email={email} initialProfile={initialProfile} />
    </section>
  );
}
