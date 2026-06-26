import { NextResponse } from "next/server";
import { updateSettings } from "@/lib/admin-store";

export async function POST(request: Request) {
  await updateSettings(await request.json());
  return NextResponse.json({ ok: true });
}
