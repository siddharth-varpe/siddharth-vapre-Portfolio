import "server-only";
import { uploadFileToStorage, deleteFileFromStorage } from "@/lib/firebase/storage";

export interface BlobUploadResult {
  url: string;
  pathname: string;
  contentType: string;
  size: number;
}

/**
 * Uploads a validated file buffer to Cloud Storage for Firebase.
 * Preserves interface compatibility for media and resume upload handlers.
 */
export async function uploadBlob(
  buffer: Buffer,
  pathname: string,
  options: { contentType: string; access?: "public" }
): Promise<BlobUploadResult> {
  const result = await uploadFileToStorage(buffer, pathname, {
    contentType: options.contentType,
    isPublic: options.access !== "public" ? false : true,
  });

  return {
    url: result.url,
    pathname: result.storagePath,
    contentType: result.contentType,
    size: result.sizeBytes,
  };
}

/**
 * Deletes a file from Cloud Storage for Firebase.
 */
export async function deleteBlob(urlOrPathname: string): Promise<void> {
  await deleteFileFromStorage(urlOrPathname);
}

// Aliases for clear semantic naming in Firebase Architecture
export const uploadToFirebaseStorage = uploadBlob;
export const deleteFromFirebaseStorage = deleteBlob;
