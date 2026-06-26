import { NextResponse } from "next/server";
import { deleteCategory, upsertCategory } from "@/lib/admin-store";

export async function POST(request: Request) {
  const body = await request.json();
  await upsertCategory({
    id: body.id || undefined,
    name: String(body.name || "").trim(),
    description: String(body.description || "")
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  await deleteCategory(searchParams.get("id") || "");
  return NextResponse.json({ ok: true });
}
