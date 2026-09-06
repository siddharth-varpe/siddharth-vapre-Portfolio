import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import { getActiveResume } from "@/lib/server/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const resume = await getActiveResume();

    if (!resume || !resume.storageUrl || !resume.downloadEnabled) {
      return NextResponse.json(
        { error: "No active public resume is currently available for download." },
        { status: 404 }
      );
    }

    // If served via local fallback storage in development
    if (resume.storageUrl.startsWith("/uploads/blob/")) {
      const relativePath = resume.storageUrl.replace("/uploads/blob/", "");
      const filePath = path.join(process.cwd(), "public", "uploads", "blob", relativePath);

      try {
        const fileBuffer = await fs.readFile(filePath);
        return new NextResponse(fileBuffer, {
          status: 200,
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="Siddharth_Varpe_Resume.pdf"`,
            "Cache-Control": "public, max-age=3600",
          },
        });
      } catch {
        return NextResponse.json(
          { error: "Resume file not found on storage." },
          { status: 404 }
        );
      }
    }

    // For Vercel Blob URLs, redirect securely to the blob URL
    return NextResponse.redirect(resume.storageUrl, 307);
  } catch (error) {
    console.error("[Resume Download Error]:", error);
    return NextResponse.json(
      { error: "Failed to process resume download request." },
      { status: 500 }
    );
  }
}
