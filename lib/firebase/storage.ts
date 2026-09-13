import "server-only";
import { adminStorage } from "./admin";

export interface StorageUploadResult {
  url: string;
  storagePath: string;
  contentType: string;
  sizeBytes: number;
}

/**
 * Uploads a validated buffer to Cloud Storage for Firebase.
 */
export async function uploadFileToStorage(
  buffer: Buffer,
  storagePath: string,
  options: {
    contentType: string;
    isPublic?: boolean;
    metadata?: Record<string, string>;
  }
): Promise<StorageUploadResult> {
  const bucket = adminStorage.bucket();
  const file = bucket.file(storagePath);

  await file.save(buffer, {
    contentType: options.contentType,
    resumable: false,
    metadata: {
      contentType: options.contentType,
      metadata: options.metadata || {},
    },
  });

  if (options.isPublic !== false) {
    try {
      await file.makePublic();
    } catch {
      // Bucket may enforce Uniform Bucket-Level Access (UBLA); public access via direct storage URL
    }
  }

  const encodedPath = encodeURIComponent(storagePath);
  const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodedPath}?alt=media`;

  return {
    url: publicUrl,
    storagePath,
    contentType: options.contentType,
    sizeBytes: buffer.length,
  };
}

/**
 * Deletes a file from Cloud Storage for Firebase.
 */
export async function deleteFileFromStorage(storagePathOrUrl: string): Promise<void> {
  if (!storagePathOrUrl) return;

  try {
    const bucket = adminStorage.bucket();
    let path = storagePathOrUrl;

    if (storagePathOrUrl.includes("/o/")) {
      const parts = storagePathOrUrl.split("/o/")[1];
      path = decodeURIComponent(parts.split("?")[0]);
    }

    const file = bucket.file(path);
    const [exists] = await file.exists();
    if (exists) {
      await file.delete();
    }
  } catch (err) {
    console.warn("[Firebase Storage]: File deletion note:", err instanceof Error ? err.message : err);
  }
}
