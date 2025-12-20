import { NextResponse } from "next/server";
import { getAdminSession, setAdminSession, updateAdminCredentials } from "@/lib/auth/admin";

export async function POST(request: Request) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const username = typeof body?.username === "string" ? body.username.trim() : "";
  const password = typeof body?.password === "string" ? body.password.trim() : "";

  if (!username || !password) {
    return NextResponse.json(
      { error: "아이디와 새 비밀번호를 모두 입력하세요." },
      { status: 400 }
    );
  }

  const updated = await updateAdminCredentials({
    currentUsername: session.username,
    username,
    password,
  });
  if (!updated) {
    return NextResponse.json({ error: "계정을 찾을 수 없습니다." }, { status: 404 });
  }
  await setAdminSession(username);

  return NextResponse.json({ ok: true });
}
