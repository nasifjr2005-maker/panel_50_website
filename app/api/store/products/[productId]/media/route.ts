import { NextResponse } from "next/server";
import { getAdminStore } from "@/lib/admin-store";
import type { AdminMedia } from "@/lib/admin-types";

function publicMedia(item: AdminMedia, featuredImageId?: string | null) {
  return {
    id: item.id,
    url: item.previewUrl || item.url,
    type: item.type,
    name: item.name,
    isFeatured: item.type === "image" && (item.isFeatured || item.id === featuredImageId)
  };
}

export async function GET(_request: Request, { params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params;
  const store = await getAdminStore();
  const product = store.categories
    .flatMap((category) => category.products)
    .find((item) => item.id === productId || item.name === decodeURIComponent(productId));

  if (!product) {
    return NextResponse.json({ media: [] }, {
      status: 404,
      headers: {
        "Cache-Control": "no-store, max-age=0"
      }
    });
  }

  const productMedia = [...product.media, ...store.media.filter((item) => item.productId === product.id)]
    .filter((item, index, list) => list.findIndex((candidate) => candidate.id === item.id) === index);

  return NextResponse.json({
    media: productMedia.map((item) => publicMedia(item, product.featuredImageId))
  }, {
    headers: {
      "Cache-Control": "no-store, max-age=0"
    }
  });
}
