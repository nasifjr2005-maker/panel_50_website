import { NextResponse } from "next/server";
import { deleteOrder, updateOrderStatus } from "@/lib/admin-store";

export async function PATCH(request: Request) {
  const body = await request.json();
  await updateOrderStatus(String(body.id || ""), body.status === "completed" ? "completed" : "pending");
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  await deleteOrder(searchParams.get("id") || "");
  return NextResponse.json({ ok: true });
}
