import { NextResponse } from "next/server";
import { createAdminSessionRecord, recordKeyAuthLogin } from "@/lib/admin-store";
import { setAdminSession } from "@/lib/auth";
import { verifyKeyAuthLogin } from "@/lib/keyauth";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  const body = await request.json().catch(() => ({}));
  const username = String(body.username || "");
  const password = String(body.password || "");
  const hwid = String(body.hwid || "");

  const userAgent = request.headers.get("user-agent") ?? "unknown";
  const keyAuthResult = await verifyKeyAuthLogin(username, password, hwid);

  if (keyAuthResult.success) {
    await recordKeyAuthLogin(keyAuthResult.username || username, ip, userAgent);
    const session = await createAdminSessionRecord(userAgent, ip);
    await setAdminSession(keyAuthResult.username || username, session.timeoutMinutes, session.sessionId);
    return NextResponse.json({ ok: true, provider: "keyauth" });
  }

  return NextResponse.json({ error: keyAuthResult.message || "Invalid KeyAuth credentials" }, { status: 401 });
}
