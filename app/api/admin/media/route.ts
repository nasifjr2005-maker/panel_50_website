import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import sharp from "sharp";
import { deleteMedia, featureProductMedia, saveMedia } from "@/lib/admin-store";
import type { AdminMedia } from "@/lib/admin-types";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "video/mp4", "video/webm"]);
const imageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

async function createImagePreview(bytes: Buffer) {
  try {
    const preview = await sharp(bytes)
      .rotate()
      .resize({ width: 360, height: 360, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();

    return `data:image/webp;base64,${preview.toString("base64")}`;
  } catch {
    return undefined;
  }
}

function summarizeMedia(item: AdminMedia) {
  return {
    id: item.id,
    productId: item.productId,
    name: item.name,
    type: item.type,
    size: item.size,
    isFeatured: item.isFeatured,
    previewUrl: item.previewUrl
  };
}

export async function POST(request: Request) {
  const form = await request.formData();
  const productId = String(form.get("productId") || "") || null;
  const isFeatured = form.get("isFeatured") === "on";
  const files = form.getAll("files").filter((item): item is File => item instanceof File);

  if (!files.length) {
    return NextResponse.json({ error: "Choose at least one image or video file." }, { status: 400 });
  }

  const media: AdminMedia[] = [];
  for (const file of files) {
    if (!allowedTypes.has(file.type)) {
      continue;
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const url = `data:${file.type};base64,${bytes.toString("base64")}`;
    const previewUrl = imageTypes.has(file.type) ? await createImagePreview(bytes) : undefined;
    media.push({
      id: randomUUID(),
      productId,
      url,
      previewUrl,
      name: file.name,
      type: file.type.startsWith("video/") ? "video" : "image",
      size: file.size,
      isFeatured,
      createdAt: new Date().toISOString()
    });
  }

  if (!media.length) {
    return NextResponse.json({ error: "Only JPG, PNG, WebP, MP4, and WebM uploads are supported." }, { status: 400 });
  }

  await saveMedia(media);
  return NextResponse.json({ ok: true, media: media.map(summarizeMedia) });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  await deleteMedia(searchParams.get("id") || "");
  return NextResponse.json({ ok: true });
}

export async function PATCH(request: Request) {
  const body = await request.json().catch(() => ({}));
  await featureProductMedia(String(body.productId || ""), String(body.mediaId || ""));
  return NextResponse.json({ ok: true });
}
