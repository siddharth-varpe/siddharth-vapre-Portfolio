import "server-only";
import crypto from "node:crypto";
import path from "node:path";

export type MediaCategory =
  | "profile"
  | "project"
  | "certificate"
  | "achievement"
  | "resume"
  | "general";

export interface FileValidationResult {
  valid: boolean;
  mimeType: string;
  extension: string;
  sizeBytes: number;
  safeKey: string;
  error?: string;
}

export const CATEGORY_SIZE_LIMITS: Record<MediaCategory, number> = {
  profile: 5 * 1024 * 1024, // 5 MB
  project: 10 * 1024 * 1024, // 10 MB
  certificate: 5 * 1024 * 1024, // 5 MB
  achievement: 5 * 1024 * 1024, // 5 MB
  resume: 5 * 1024 * 1024, // 5 MB
  general: 5 * 1024 * 1024, // 5 MB
};

const ALLOWED_IMAGE_MIMES: Record<string, { ext: string; name: string }> = {
  "image/png": { ext: "png", name: "PNG" },
  "image/jpeg": { ext: "jpg", name: "JPEG" },
  "image/webp": { ext: "webp", name: "WebP" },
};

const ALLOWED_DOC_MIMES: Record<string, { ext: string; name: string }> = {
  "application/pdf": { ext: "pdf", name: "PDF" },
};

/**
 * Checks magic byte header to identify real binary format.
 */
export function detectFormatFromBuffer(buffer: Buffer): {
  detectedMime: string;
  detectedExt: string;
} | null {
  if (!buffer || buffer.length < 4) return null;

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { detectedMime: "image/png", detectedExt: "png" };
  }

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { detectedMime: "image/jpeg", detectedExt: "jpg" };
  }

  // WebP: 'RIFF' .... 'WEBP'
  if (
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return { detectedMime: "image/webp", detectedExt: "webp" };
  }

  // PDF: %PDF (25 50 44 46)
  if (buffer.length >= 5 && buffer.toString("ascii", 0, 5).startsWith("%PDF-")) {
    return { detectedMime: "application/pdf", detectedExt: "pdf" };
  }

  return null;
}

/**
 * Path traversal defense and sanitized key generation.
 * Generates an application-controlled, collision-resistant key inside portfolio/{category}/.
 */
export function generateSafeStorageKey(
  category: MediaCategory,
  originalFilename: string,
  extension: string
): string {
  // Normalize and extract only the final base name
  const rawBase = path.basename(originalFilename);

  // Strip non-alphanumeric characters from basename (preserving hyphens and underscores)
  const sanitizedSlug = rawBase
    .replace(/\.[^/.]+$/, "") // strip extension
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40) || "asset";

  const timestamp = Date.now();
  const randomSuffix = crypto.randomBytes(4).toString("hex");
  const cleanExt = extension.replace(/^\./, "").toLowerCase();

  return `portfolio/${category}/${timestamp}-${randomSuffix}-${sanitizedSlug}.${cleanExt}`;
}

/**
 * Full file validation engine.
 * Validates file size, category eligibility, MIME type, extension, and magic bytes.
 */
export function validateUploadBuffer(
  buffer: Buffer,
  category: MediaCategory,
  declaredFilename: string,
  declaredMimeType?: string
): FileValidationResult {
  const sizeBytes = buffer.length;

  // 1. Size Limit Check
  const maxAllowedBytes = CATEGORY_SIZE_LIMITS[category] || 5 * 1024 * 1024;
  if (sizeBytes > maxAllowedBytes) {
    return {
      valid: false,
      mimeType: "",
      extension: "",
      sizeBytes,
      safeKey: "",
      error: `File size exceeds the maximum limit of ${Math.round(maxAllowedBytes / 1024 / 1024)}MB for ${category}.`,
    };
  }

  if (sizeBytes === 0) {
    return {
      valid: false,
      mimeType: "",
      extension: "",
      sizeBytes,
      safeKey: "",
      error: "Uploaded file is empty (0 bytes).",
    };
  }

  // 2. Magic byte detection (ground truth)
  const detected = detectFormatFromBuffer(buffer);
  if (!detected) {
    return {
      valid: false,
      mimeType: "",
      extension: "",
      sizeBytes,
      safeKey: "",
      error: "Unsupported or corrupt file format. Binary header signature did not match approved image or document types.",
    };
  }

  const { detectedMime, detectedExt } = detected;

  // 3. Category format restrictions
  if (category === "resume") {
    if (detectedMime !== "application/pdf") {
      return {
        valid: false,
        mimeType: detectedMime,
        extension: detectedExt,
        sizeBytes,
        safeKey: "",
        error: "Resume files must be valid PDF documents.",
      };
    }
  } else if (category === "profile" || category === "project") {
    if (!ALLOWED_IMAGE_MIMES[detectedMime]) {
      return {
        valid: false,
        mimeType: detectedMime,
        extension: detectedExt,
        sizeBytes,
        safeKey: "",
        error: `${category} uploads must be PNG, JPEG, or WebP images.`,
      };
    }
  } else {
    // certificate, achievement, general allow both images and PDF
    if (!ALLOWED_IMAGE_MIMES[detectedMime] && !ALLOWED_DOC_MIMES[detectedMime]) {
      return {
        valid: false,
        mimeType: detectedMime,
        extension: detectedExt,
        sizeBytes,
        safeKey: "",
        error: "Allowed formats are PNG, JPEG, WebP, and PDF.",
      };
    }
  }

  // 4. Client-declared extension check (if provided)
  const declaredExt = path.extname(declaredFilename).replace(/^\./, "").toLowerCase();
  const validExtensions = detectedMime === "image/jpeg" ? ["jpg", "jpeg"] : [detectedExt];

  if (declaredExt && !validExtensions.includes(declaredExt)) {
    return {
      valid: false,
      mimeType: detectedMime,
      extension: detectedExt,
      sizeBytes,
      safeKey: "",
      error: `File extension mismatch: declared .${declaredExt} but file contents are ${detectedMime}.`,
    };
  }

  // 5. Client-declared MIME check (if provided and not generic octet-stream)
  if (declaredMimeType && declaredMimeType !== "application/octet-stream") {
    const normalizedDeclared = declaredMimeType.toLowerCase().trim();
    const isJpegVariant = detectedMime === "image/jpeg" && normalizedDeclared === "image/jpg";
    if (normalizedDeclared !== detectedMime && !isJpegVariant) {
      return {
        valid: false,
        mimeType: detectedMime,
        extension: detectedExt,
        sizeBytes,
        safeKey: "",
        error: `MIME type mismatch: declared '${declaredMimeType}' but detected '${detectedMime}'.`,
      };
    }
  }

  // 5. Generate Safe Storage Key
  const safeKey = generateSafeStorageKey(category, declaredFilename, detectedExt);

  return {
    valid: true,
    mimeType: detectedMime,
    extension: detectedExt,
    sizeBytes,
    safeKey,
  };
}
