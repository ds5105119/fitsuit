import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/admin";
import { createAdminUser, deleteAdminUser, getAdminUserByUsername, listAdminUsers } from "@/lib/auth/admin";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await listAdminUsers();

  return NextResponse.json({
    users: users.map((user) => ({
      username: user.username,
      createdAt: user.createdAt,
    })),
    currentUsername: session.username,
  });
}

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
      { error: "아이디와 비밀번호를 모두 입력하세요." },
      { status: 400 }
    );
  }

  if (username.length < 3 || password.length < 6) {
    return NextResponse.json(
      { error: "아이디는 3자 이상, 비밀번호는 6자 이상이어야 합니다." },
      { status: 400 }
    );
  }

  const existing = await getAdminUserByUsername(username);
  if (existing) {
    return NextResponse.json({ error: "이미 존재하는 아이디입니다." }, { status: 409 });
  }

  const created = await createAdminUser({ username, password });
  if (!created) {
    return NextResponse.json({ error: "계정 생성에 실패했습니다." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const username = typeof body?.username === "string" ? body.username.trim() : "";

  if (!username) {
    return NextResponse.json({ error: "삭제할 아이디를 입력하세요." }, { status: 400 });
  }

  if (username === session.username) {
    return NextResponse.json({ error: "본인 계정은 삭제할 수 없습니다." }, { status: 400 });
  }

  const users = await listAdminUsers();
  if (users.length <= 1) {
    return NextResponse.json({ error: "최소 1명의 관리자는 유지되어야 합니다." }, { status: 400 });
  }

  const existing = users.find((user) => user.username === username);
  if (!existing) {
    return NextResponse.json({ error: "계정을 찾을 수 없습니다." }, { status: 404 });
  }

  const deleted = await deleteAdminUser(username);
  if (!deleted) {
    return NextResponse.json({ error: "삭제에 실패했습니다." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
