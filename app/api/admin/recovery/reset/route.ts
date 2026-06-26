import { NextResponse } from "next/server";
import { resetPasswordWithToken } from "@/lib/admin-store";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const token = String(body.token || "");
  const password = String(body.password || "");

  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }

  const ok = await resetPasswordWithToken(token, password);
  if (!ok) {
    return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
