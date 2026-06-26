import { NextResponse } from "next/server";
import { createWhatsappRecoveryRequest, getAdminStore, updateRecoveryRequest } from "@/lib/admin-store";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const username = String(body.username || "unknown");
  const store = await getAdminStore();
  const recovery = await createWhatsappRecoveryRequest(username);
  const text = [
    "PANEL 50 Admin Recovery Request",
    `Username: ${username}`,
    `Recovery Request ID: ${recovery.id}`,
    `Timestamp: ${recovery.timestamp}`,
    "Please verify manually before approving any reset."
  ].join("\n");
  const number = store.adminUser.whatsappNumber.replace(/[^\d]/g, "");
  return NextResponse.json({ ok: true, request: recovery, whatsappUrl: `https://wa.me/${number}?text=${encodeURIComponent(text)}` });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  await updateRecoveryRequest(String(body.id || ""), body.status === "approved" ? "approved" : "rejected");
  return NextResponse.json({ ok: true });
}
