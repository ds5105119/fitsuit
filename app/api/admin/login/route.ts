import { NextResponse } from "next/server";
import {
  setAdminSession,
  verifyAdminCredentials,
} from "@/lib/auth/admin";

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (!username || !password) {
    return NextResponse.json(
      { error: "아이디와 비밀번호를 입력하세요." },
      { status: 400 }
    );
  }

  const ok = await verifyAdminCredentials(username, password);

  if (!ok) {
    return NextResponse.json(
      { error: "아이디 또는 비밀번호가 올바르지 않습니다." },
      { status: 401 }
    );
  }

  await setAdminSession(username);

  return NextResponse.json({ ok: true });
}
