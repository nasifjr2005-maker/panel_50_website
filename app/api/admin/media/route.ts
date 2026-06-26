import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { deleteMedia, saveMedia } from "@/lib/admin-store";
import type { AdminMedia } from "@/lib/admin-types";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "video/mp4", "video/webm"]);

export async function POST(request: Request) {
  const form = await request.formData();
  const productId = String(form.get("productId") || "") || null;
  const isFeatured = form.get("isFeatured") === "on";
  const files = form.getAll("files").filter((item): item is File => item instanceof File);

  const media: AdminMedia[] = [];
  for (const file of files) {
    if (!allowedTypes.has(file.type)) {
      continue;
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const url = `data:${file.type};base64,${bytes.toString("base64")}`;
    media.push({
      id: randomUUID(),
      productId,
      url,
      name: file.name,
      type: file.type.startsWith("video/") ? "video" : "image",
      size: file.size,
      isFeatured,
      createdAt: new Date().toISOString()
    });
  }

  await saveMedia(media);
  return NextResponse.json({ ok: true, media });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  await deleteMedia(searchParams.get("id") || "");
  return NextResponse.json({ ok: true });
}
