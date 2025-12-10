import { NextResponse } from "next/server";
import { getAdminSession, updateAdminCredentials } from "@/lib/auth/admin";

export async function POST(request: Request) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { username, password } = await request.json();

  if (!username || !password) {
    return NextResponse.json(
      { error: "아이디와 새 비밀번호를 모두 입력하세요." },
      { status: 400 }
    );
  }

  await updateAdminCredentials({ username, password });

  return NextResponse.json({ ok: true });
}
