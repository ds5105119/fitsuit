import { NextResponse } from "next/server";
import { createUserWithCredentials, getUserCredentialByEmail } from "@/lib/auth/user";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const payload = body as Record<string, unknown>;
  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  const password = typeof payload.password === "string" ? payload.password : "";
  const userName = typeof payload.userName === "string" ? payload.userName.trim() : "";

  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: "유효한 이메일을 입력해 주세요." }, { status: 400 });
  }
  if (email.length > 160) {
    return NextResponse.json({ error: "이메일 길이가 너무 깁니다." }, { status: 400 });
  }
  if (!password || password.length < 6) {
    return NextResponse.json({ error: "비밀번호는 6자 이상이어야 합니다." }, { status: 400 });
  }
  if (userName.length > 120) {
    return NextResponse.json({ error: "이름은 120자 이하여야 합니다." }, { status: 400 });
  }

  const existing = await getUserCredentialByEmail(email);
  if (existing) {
    return NextResponse.json({ error: "이미 가입된 이메일입니다." }, { status: 409 });
  }

  try {
    await createUserWithCredentials({
      email,
      password,
      userName: userName || null,
    });
  } catch (error) {
    console.error("signup error", error);
    return NextResponse.json({ error: "회원가입에 실패했습니다." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
