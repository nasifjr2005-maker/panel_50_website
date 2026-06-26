import { NextResponse } from "next/server";
import { deleteProduct, upsertProduct } from "@/lib/admin-store";

export async function POST(request: Request) {
  const body = await request.json();
  await upsertProduct({
    id: body.id,
    name: String(body.name || "").trim(),
    description: String(body.description || ""),
    enabled: Boolean(body.enabled),
    categoryId: String(body.categoryId || "")
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  await deleteProduct(searchParams.get("id") || "");
  return NextResponse.json({ ok: true });
}
