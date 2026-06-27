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

export async function uploadMediaToCloudinary(bytes: Buffer, mimeType: string, fileName: string) {
  if (!configureCloudinary()) {
    return null;
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
    url: result.secure_url,
    previewUrl: resourceType === "image"
      ? cloudinary.url(result.public_id, {
        secure: true,
        transformation: [
          { width: 360, height: 360, crop: "fit" },
          { fetch_format: "auto", quality: "auto" }
        ]
      })
      : result.secure_url,
    providerId: result.public_id,
    size: result.bytes,
    format: result.format,
    width: result.width,
    height: result.height
  };
}
