import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import { put, del, head } from "@vercel/blob";

export interface BlobUploadResult {
  url: string;
  pathname: string;
  contentType: string;
  size: number;
}

/**
 * Checks if a live Vercel Blob token is configured in the environment.
 */
export function hasLiveBlobToken(): boolean {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  return Boolean(
    token &&
      token.trim().length > 0 &&
      !token.includes("placeholder") &&
      !token.includes("<")
  );
}

/**
 * Uploads a validated file buffer to Vercel Blob storage.
 * Seamlessly falls back to local public storage in development if no token is configured.
 */
export async function uploadBlob(
  buffer: Buffer,
  pathname: string,
  options: { contentType: string; access?: "public" }
): Promise<BlobUploadResult> {
  const access = options.access || "public";
  const contentType = options.contentType;

  if (hasLiveBlobToken()) {
    try {
      const blob = await put(pathname, buffer, {
        access,
        contentType,
        addRandomSuffix: false, // pathname already includes collision-resistant suffix
      });

      return {
        url: blob.url,
        pathname: blob.pathname,
        contentType: options.contentType,
        size: buffer.length,
      };
    } catch (err: unknown) {
      console.error("[Vercel Blob Upload Error]:", err instanceof Error ? err.message : err);
      throw new Error("Failed to store asset in Vercel Blob object storage.");
    }
  }

  // Development Fallback: Store locally in public/uploads/blob/
  try {
    const localDir = path.join(process.cwd(), "public", "uploads", "blob", path.dirname(pathname));
    await fs.mkdir(localDir, { recursive: true });

    const localFilePath = path.join(process.cwd(), "public", "uploads", "blob", pathname);
    await fs.writeFile(localFilePath, buffer);

    const localUrl = `/uploads/blob/${pathname}`;

    return {
      url: localUrl,
      pathname,
      contentType,
      size: buffer.length,
    };
  } catch (err: unknown) {
    console.error("[Local Storage Fallback Error]:", err instanceof Error ? err.message : err);
    throw new Error("Failed to write asset to local fallback storage.");
  }
}

/**
 * Deletes a stored asset from Vercel Blob (or local fallback storage).
 */
export async function deleteBlob(storageUrl: string): Promise<boolean> {
  if (!storageUrl) return false;

  if (hasLiveBlobToken() && (storageUrl.startsWith("http://") || storageUrl.startsWith("https://"))) {
    try {
      await del(storageUrl);
      return true;
    } catch (err: unknown) {
      console.error("[Vercel Blob Delete Error]:", err instanceof Error ? err.message : err);
      return false;
    }
  }

  // Local fallback deletion
  if (storageUrl.startsWith("/uploads/blob/")) {
    try {
      const relativePath = storageUrl.replace("/uploads/blob/", "");
      const localFilePath = path.join(process.cwd(), "public", "uploads", "blob", relativePath);
      await fs.unlink(localFilePath);
      return true;
    } catch {
      return false;
    }
  }

  return false;
}

/**
 * Retrieves metadata for a stored blob if supported.
 */
export async function getBlobMetadata(storageUrl: string) {
  if (!storageUrl) return null;

  if (hasLiveBlobToken() && (storageUrl.startsWith("http://") || storageUrl.startsWith("https://"))) {
    try {
      return await head(storageUrl);
    } catch {
      return null;
    }
  }

  return null;
}
