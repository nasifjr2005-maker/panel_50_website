import { NextResponse } from "next/server";
import { updateCommunityLinks } from "@/lib/admin-store";

export async function POST(request: Request) {
  await updateCommunityLinks(await request.json());
  return NextResponse.json({ ok: true });
}
