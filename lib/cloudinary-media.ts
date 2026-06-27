import { v2 as cloudinary } from "cloudinary";

type CloudinaryUploadResult = {
  secure_url: string;
  public_id: string;
  resource_type: string;
  bytes: number;
  format: string;
  width?: number;
  height?: number;
};

function hasCloudinaryConfig() {
  return Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
}

function configureCloudinary() {
  if (!hasCloudinaryConfig()) {
    return false;
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });

  return true;
}

function dataUrlFromBuffer(bytes: Buffer, mimeType: string) {
  return `data:${mimeType};base64,${bytes.toString("base64")}`;
}

export function isCloudinaryConfigured() {
  return hasCloudinaryConfig();
}

export function optimizedCloudinaryUrl(publicId: string, type: "image" | "video") {
  if (!configureCloudinary()) {
    return "";
  }

  if (type === "video") {
    return cloudinary.url(publicId, {
      secure: true,
      resource_type: "video",
      transformation: [
        { quality: "auto", fetch_format: "auto" }
      ]
    });
  }

  return cloudinary.url(publicId, {
    secure: true,
    transformation: [
      { width: 720, crop: "limit" },
      { fetch_format: "auto", quality: "auto" }
    ]
  });
}

export async function uploadMediaToCloudinary(bytes: Buffer, mimeType: string, fileName: string) {
  if (!configureCloudinary()) {
    throw new Error("Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.");
  }

  const resourceType = mimeType.startsWith("video/") ? "video" : "image";
  const result = await cloudinary.uploader.upload(dataUrlFromBuffer(bytes, mimeType), {
    folder: "panel-50/admin-media",
    resource_type: resourceType,
    use_filename: true,
    unique_filename: true,
    filename_override: fileName
  }) as CloudinaryUploadResult;

  return {
    url: optimizedCloudinaryUrl(result.public_id, resourceType),
    previewUrl: resourceType === "image"
      ? cloudinary.url(result.public_id, {
        secure: true,
        transformation: [
          { width: 360, height: 360, crop: "fit" },
          { fetch_format: "auto", quality: "auto" }
        ]
      })
      : optimizedCloudinaryUrl(result.public_id, resourceType),
    providerId: result.public_id,
    size: result.bytes,
    format: result.format,
    width: result.width,
    height: result.height
  };
}

export async function deleteMediaFromCloudinary(publicId: string, type: "image" | "video") {
  if (!publicId || !configureCloudinary()) {
    return;
  }

  await cloudinary.uploader.destroy(publicId, {
    resource_type: type
  });
}
