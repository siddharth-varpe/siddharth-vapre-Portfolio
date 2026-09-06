import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/server/auth/session";
import { createAdminMediaWithAssociation } from "@/lib/server/db";
import {
  validateUploadBuffer,
  MediaCategory,
} from "@/lib/server/storage/validation";
import { uploadBlob, deleteBlob } from "@/lib/server/storage/blob";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const session = await requireAdminSession({ isApi: true });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "No file provided in upload payload" },
        { status: 400 }
      );
    }

    const category = (formData.get("category") as MediaCategory) || "general";
    const visibility = (formData.get("visibility") as "public" | "private") || "public";
    const associatedContentType = formData.get("associatedContentType") as
      | "profile"
      | "project"
      | "achievement"
      | "certification"
      | undefined;
    const associatedContentId = (formData.get("associatedContentId") as string) || undefined;

    // Convert file to Buffer for server-side byte inspection
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 1. File Validation (Magic Bytes, MIME, Extension, Size, Safe Key)
    const validation = validateUploadBuffer(
      buffer,
      category,
      file.name,
      file.type
    );

    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error || "File validation failed" },
        { status: 400 }
      );
    }

    // 2. Storage Operation: Upload to Vercel Blob (or dev fallback)
    const blobResult = await uploadBlob(buffer, validation.safeKey, {
      contentType: validation.mimeType,
      access: "public",
    });

    // 3. Database Metadata Persistence & Association
    try {
      const mediaRecord = await createAdminMediaWithAssociation(
        {
          filename: file.name,
          storageUrl: blobResult.url,
          storageKey: validation.safeKey,
          mimeType: validation.mimeType,
          sizeBytes: validation.sizeBytes,
          category,
          visibility,
          associatedContentType: associatedContentType || undefined,
          associatedContentId: associatedContentId || undefined,
        },
        session.user.name || session.user.email || "admin"
      );

      return NextResponse.json(
        {
          success: true,
          data: mediaRecord,
        },
        { status: 201 }
      );
    } catch (dbError) {
      // Consistency Protection: Roll back uploaded blob on DB failure
      console.error("[Media DB Rollback]: Deleting orphaned blob due to database error:", dbError);
      await deleteBlob(blobResult.url);
      throw dbError;
    }
  } catch (error) {
    console.error("[Admin Media Upload Error]:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upload media" },
      { status: 500 }
    );
  }
}
