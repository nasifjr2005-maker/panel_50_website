import { NextResponse } from "next/server";
import { createPasswordResetToken, getAdminStore } from "@/lib/admin-store";

export async function POST(request: Request) {
  const store = await getAdminStore();
  const token = await createPasswordResetToken();
  const url = new URL(request.url);
  const resetUrl = `${url.origin}/admin/reset-password?token=${token}`;
  const body = `PANEL 50 admin password reset link:\n\n${resetUrl}\n\nThis link expires in 15 minutes and can only be used once.`;

  await fetch(`https://formsubmit.co/ajax/${store.adminUser.recoveryEmail}`, {
    method: "POST",
    headers: { Accept: "application/json" },
    body: (() => {
      const form = new FormData();
      form.append("_subject", "PANEL 50 Admin Password Reset");
      form.append("_template", "table");
      form.append("_captcha", "false");
      form.append("message", body);
      form.append("reset_link", resetUrl);
      return form;
    })()
  }).catch(() => null);

  return NextResponse.json({
    ok: true,
    message: `Recovery email sent to ${store.adminUser.recoveryEmail}`,
    resetUrl: process.env.NODE_ENV === "production" ? undefined : resetUrl
  });
}
