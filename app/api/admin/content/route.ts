import { NextResponse } from "next/server";
import { updateContent } from "@/lib/admin-store";

export async function POST(request: Request) {
  await updateContent(await request.json());
  return NextResponse.json({ ok: true });
}
