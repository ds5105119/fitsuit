import { NextResponse } from "next/server";
import {
  setAdminSession,
  verifyAdminCredentials,
} from "@/lib/auth/admin";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const username = typeof body?.username === "string" ? body.username.trim() : "";
  const password = typeof body?.password === "string" ? body.password.trim() : "";

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
