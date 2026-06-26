import { NextResponse } from "next/server";
import { updateTestimonials } from "@/lib/admin-store";

export async function POST(request: Request) {
  await updateTestimonials(await request.json());
  return NextResponse.json({ ok: true });
}
