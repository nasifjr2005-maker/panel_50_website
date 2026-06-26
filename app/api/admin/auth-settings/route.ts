import { NextResponse } from "next/server";
import { revokeAllSessions, updateAdminAuthSettings } from "@/lib/admin-store";

export async function POST(request: Request) {
  const body = await request.json();
  const username = String(body.username || "").trim();
  const password = body.password ? String(body.password) : undefined;
  const sessionTimeoutMinutes = Number(body.sessionTimeoutMinutes || 480);

  if (username.length < 3) {
    return NextResponse.json({ error: "Username must be at least 3 characters." }, { status: 400 });
  }

  if (password && password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  if (!Number.isFinite(sessionTimeoutMinutes) || sessionTimeoutMinutes < 15) {
    return NextResponse.json({ error: "Session timeout must be at least 15 minutes." }, { status: 400 });
  }

  await updateAdminAuthSettings({
    username,
    password,
    recoveryEmail: String(body.recoveryEmail || "nasifjr2005@gmail.com"),
    backupRecoveryEmail: String(body.backupRecoveryEmail || ""),
    whatsappNumber: String(body.whatsappNumber || "+8801823666560"),
    sessionTimeoutMinutes
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  await revokeAllSessions();
  return NextResponse.json({ ok: true });
}
