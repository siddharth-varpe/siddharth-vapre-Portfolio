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

    // If local relative file path
    if (resume.storageUrl.startsWith("/")) {
      const cleanPath = resume.storageUrl.startsWith("/")
        ? resume.storageUrl.slice(1)
        : resume.storageUrl;
      const filePath = path.join(process.cwd(), "public", cleanPath);

      try {
        const fileBuffer = await fs.readFile(filePath);
        return new NextResponse(fileBuffer, {
          status: 200,
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="${resume.filename || "Siddharth_Varpe_Resume.pdf"}"`,
            "Cache-Control": "public, max-age=3600",
          },
        });
      } catch {
        // Fallback to public/resume.pdf if specific path moved
        try {
          const fallbackBuffer = await fs.readFile(path.join(process.cwd(), "public", "resume.pdf"));
          return new NextResponse(fallbackBuffer, {
            status: 200,
            headers: {
              "Content-Type": "application/pdf",
              "Content-Disposition": `attachment; filename="${resume.filename || "Siddharth_Varpe_Resume.pdf"}"`,
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
    }

    // For absolute cloud storage URLs, redirect securely
    if (resume.storageUrl.startsWith("http://") || resume.storageUrl.startsWith("https://")) {
      return NextResponse.redirect(resume.storageUrl, 307);
    }
  } catch (error) {
    console.error("[Resume Download Error]:", error);
    return NextResponse.json(
      { error: "Failed to process resume download request." },
      { status: 500 }
    );
  }
}
