import { NextResponse } from "next/server";
import { updateFaqs } from "@/lib/admin-store";

export async function POST(request: Request) {
  await updateFaqs(await request.json());
  return NextResponse.json({ ok: true });
}
