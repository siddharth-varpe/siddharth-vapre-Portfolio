import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/server/auth/session";
import { createAdminResume, updateAdminResume } from "@/lib/server/db";
import { validateUploadBuffer } from "@/lib/server/storage/validation";
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
        { error: "No resume PDF file provided in upload payload" },
        { status: 400 }
      );
    }

    const version = (formData.get("version") as string)?.trim() || new Date().toISOString().slice(0, 10);
    const makeActive = formData.get("makeActive") === "true" || formData.get("active") === "true";
    const downloadEnabled = formData.get("downloadEnabled") !== "false";

    // Convert file to Buffer for server-side byte inspection
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 1. Validate PDF file (Magic bytes '%PDF-', extension '.pdf', size <= 5MB)
    const validation = validateUploadBuffer(
      buffer,
      "resume",
      file.name,
      file.type
    );

    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error || "Invalid resume file" },
        { status: 400 }
      );
    }

    // 2. Upload to Vercel Blob (or dev fallback)
    const blobResult = await uploadBlob(buffer, validation.safeKey, {
      contentType: "application/pdf",
      access: "public",
    });

    // 3. Persist in Database
    try {
      const createdResume = await createAdminResume(
        {
          filename: file.name,
          storageUrl: blobResult.url,
          version,
          active: makeActive,
          archived: false,
          downloadEnabled,
          fileSizeBytes: validation.sizeBytes,
        },
        session.user.name || session.user.email || "admin"
      );

      // If requested as active, ensure other versions are deactivated
      if (makeActive && createdResume._id) {
        await updateAdminResume(
          createdResume._id.toString(),
          { active: true },
          session.user.name || session.user.email || "admin"
        );
      }

      return NextResponse.json(
        {
          success: true,
          data: createdResume,
        },
        { status: 201 }
      );
    } catch (dbError) {
      console.error("[Resume DB Rollback]: Deleting orphaned blob due to database error:", dbError);
      await deleteBlob(blobResult.url);
      throw dbError;
    }
  } catch (error) {
    console.error("[Admin Resume Upload Error]:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upload resume" },
      { status: 500 }
    );
  }
}
