import { NextResponse } from "next/server";
import { upsertInquiry, upsertOrder } from "@/lib/admin-store";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));

  if (body.productName) {
    await upsertOrder({
      name: String(body.name || "Customer"),
      email: String(body.email || ""),
      whatsapp: String(body.whatsapp || body.contact || ""),
      productId: body.productId ? String(body.productId) : null,
      productName: String(body.productName),
      duration: String(body.duration || ""),
      bdt: Number(body.bdt || 0),
      usd: String(body.usd || ""),
      message: String(body.message || "")
    });
  } else {
    await upsertInquiry({
      name: String(body.name || "Visitor"),
      email: String(body.email || ""),
      message: String(body.message || "")
    });
  }

  return NextResponse.json({ ok: true });
}
