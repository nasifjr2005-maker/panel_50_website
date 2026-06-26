import { NextResponse } from "next/server";
import { updateProductPrices } from "@/lib/admin-store";

export async function POST(request: Request) {
  const body = await request.json();
  await updateProductPrices(String(body.productId || ""), body.prices ?? []);
  return NextResponse.json({ ok: true });
}
