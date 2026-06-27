import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { deleteMedia, featureProductMedia, replaceMedia, saveMedia } from "@/lib/admin-store";
import { deleteMediaFromCloudinary, isCloudinaryConfigured, uploadMediaToCloudinary } from "@/lib/cloudinary-media";
import type { AdminMedia } from "@/lib/admin-types";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "video/mp4", "video/webm"]);

function summarizeMedia(item: AdminMedia) {
  return {
    id: item.id,
    productId: item.productId,
    name: item.name,
    type: item.type,
    size: item.size,
    provider: item.provider,
    isFeatured: item.isFeatured,
    previewUrl: item.previewUrl
  };
}

async function uploadedMediaFromFile(file: File, productId: string | null, isFeatured: boolean) {
  if (!allowedTypes.has(file.type)) {
    return null;
  }

  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your deployment environment.");
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const cloudinaryUpload = await uploadMediaToCloudinary(bytes, file.type, file.name);
  return {
    id: randomUUID(),
    productId,
    url: cloudinaryUpload.url,
    previewUrl: cloudinaryUpload.previewUrl,
    provider: "cloudinary" as const,
    providerId: cloudinaryUpload.providerId,
    name: file.name,
    type: file.type.startsWith("video/") ? "video" : "image",
    size: cloudinaryUpload.size,
    isFeatured,
    createdAt: new Date().toISOString()
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
  try {
    for (const file of files) {
      const item = await uploadedMediaFromFile(file, productId, isFeatured);
      if (item) {
        media.push(item);
      }
    }
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Cloudinary upload failed." }, { status: 500 });
  }

  if (!media.length) {
    return NextResponse.json({ error: "Only JPG, PNG, WebP, MP4, and WebM uploads are supported." }, { status: 400 });
  }

  await saveMedia(media);
  return NextResponse.json({ ok: true, media: media.map(summarizeMedia) });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const deleted = await deleteMedia(searchParams.get("id") || "");
  if (deleted?.provider === "cloudinary" && deleted.providerId) {
    await deleteMediaFromCloudinary(deleted.providerId, deleted.type === "video" ? "video" : "image");
  }
  return NextResponse.json({ ok: true });
}

export async function PUT(request: Request) {
  const form = await request.formData();
  const mediaId = String(form.get("mediaId") || "");
  const file = form.get("file");
  if (!mediaId || !(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Choose a media item and replacement file." }, { status: 400 });
  }

  try {
    const replacement = await uploadedMediaFromFile(file, null, false);
    if (!replacement) {
      return NextResponse.json({ error: "Only JPG, PNG, WebP, MP4, and WebM uploads are supported." }, { status: 400 });
    }
    const replaced = await replaceMedia(mediaId, replacement);
    if (replaced?.provider === "cloudinary" && replaced.providerId) {
      await deleteMediaFromCloudinary(replaced.providerId, replaced.type === "video" ? "video" : "image");
    }
    return NextResponse.json({ ok: true, media: summarizeMedia({ ...replacement, id: mediaId }) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not replace media." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const body = await request.json().catch(() => ({}));
  await featureProductMedia(String(body.productId || ""), String(body.mediaId || ""));
  return NextResponse.json({ ok: true });
}
