import { NextResponse } from "next/server";
import { deleteInquiry, updateInquiryRead } from "@/lib/admin-store";

export async function PATCH(request: Request) {
  const body = await request.json();
  await updateInquiryRead(String(body.id || ""), Boolean(body.isRead));
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  await deleteInquiry(searchParams.get("id") || "");
  return NextResponse.json({ ok: true });
}
