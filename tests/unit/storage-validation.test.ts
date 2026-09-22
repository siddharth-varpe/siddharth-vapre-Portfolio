import { describe, it, expect } from "vitest";
import {
  detectFormatFromBuffer,
  generateSafeStorageKey,
  validateUploadBuffer,
} from "@/lib/server/storage/validation";

describe("Storage Validation & File Upload Security", () => {
  // Test Buffer fixtures with authentic magic bytes
  const pngHeader = Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
  ]);
  const jpegHeader = Buffer.from([
    0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46,
  ]);
  const webpHeader = Buffer.concat([
    Buffer.from("RIFF", "ascii"),
    Buffer.from([0x24, 0x00, 0x00, 0x00]),
    Buffer.from("WEBP", "ascii"),
  ]);
  const pdfHeader = Buffer.from("%PDF-1.7 authentic pdf content bytes");

  describe("detectFormatFromBuffer (Magic Bytes)", () => {
    it("correctly identifies PNG magic bytes", () => {
      const format = detectFormatFromBuffer(pngHeader);
      expect(format).toEqual({ detectedMime: "image/png", detectedExt: "png" });
    });

    it("correctly identifies JPEG magic bytes", () => {
      const format = detectFormatFromBuffer(jpegHeader);
      expect(format).toEqual({ detectedMime: "image/jpeg", detectedExt: "jpg" });
    });

    it("correctly identifies WebP magic bytes", () => {
      const format = detectFormatFromBuffer(webpHeader);
      expect(format).toEqual({ detectedMime: "image/webp", detectedExt: "webp" });
    });

    it("correctly identifies PDF magic bytes", () => {
      const format = detectFormatFromBuffer(pdfHeader);
      expect(format).toEqual({ detectedMime: "application/pdf", detectedExt: "pdf" });
    });

    it("rejects plain text or arbitrary executable bytes disguised as images", () => {
      const maliciousScript = Buffer.from("<script>alert('xss')</script>");
      expect(detectFormatFromBuffer(maliciousScript)).toBeNull();

      const elfExecutable = Buffer.from([0x7f, 0x45, 0x4c, 0x46, 0x02, 0x01]);
      expect(detectFormatFromBuffer(elfExecutable)).toBeNull();
    });
  });

  describe("Path Traversal Defense (generateSafeStorageKey)", () => {
    it("strips directory traversal paths from filename", () => {
      const maliciousName = "../../../../etc/passwd.png";
      const key = generateSafeStorageKey("profile", maliciousName, "png");

      expect(key.startsWith("portfolio/profile/")).toBe(true);
      expect(key).not.toContain("..");
      expect(key).not.toContain("/etc/");
      expect(key).toMatch(/^portfolio\/profile\/[a-z0-9-]+-passwd\.png$/);
    });

    it("sanitizes null bytes and Windows path separators", () => {
      const windowsExploit = "..\\..\\windows\\system32\\cmd.exe.jpg";
      const key = generateSafeStorageKey("project", windowsExploit, "jpg");

      expect(key.startsWith("portfolio/project/")).toBe(true);
      expect(key).not.toContain("..\\");
      expect(key).not.toContain("windows");
      expect(key).not.toContain("system32");
      expect(key).toContain("cmd-exe.jpg");
    });
  });

  describe("validateUploadBuffer", () => {
    it("validates legitimate PNG upload for profile category", () => {
      const res = validateUploadBuffer(pngHeader, "profile", "avatar.png", "image/png");
      expect(res.valid).toBe(true);
      expect(res.mimeType).toBe("image/png");
      expect(res.extension).toBe("png");
      expect(res.safeKey).toContain("portfolio/profile/");
    });

    it("rejects PDF upload in profile category (must be image)", () => {
      const res = validateUploadBuffer(pdfHeader, "profile", "doc.pdf", "application/pdf");
      expect(res.valid).toBe(false);
      expect(res.error).toContain("must be PNG, JPEG, or WebP");
    });

    it("enforces category size limits", () => {
      // 6MB buffer exceeds 5MB profile limit
      const oversizedBuffer = Buffer.alloc(6 * 1024 * 1024);
      pngHeader.copy(oversizedBuffer);

      const res = validateUploadBuffer(oversizedBuffer, "profile", "large.png", "image/png");
      expect(res.valid).toBe(false);
      expect(res.error).toContain("exceeds the maximum limit");
    });

    it("rejects MIME type / extension mismatch", () => {
      // PNG buffer with declared .jpg extension
      const res = validateUploadBuffer(pngHeader, "profile", "avatar.jpg", "image/jpeg");
      expect(res.valid).toBe(false);
      expect(res.error).toContain("mismatch");
    });
  });
});
