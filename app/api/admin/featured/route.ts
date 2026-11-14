import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/server/auth/session";
import { getAdminFeaturedSection, updateAdminFeaturedSection } from "@/lib/server/db";
import { featuredSectionConfigSchema } from "@/lib/validations/models";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const featuredSection = await getAdminFeaturedSection();
    return NextResponse.json({ featuredSection });
  } catch (error) {
    console.error("[API Error] Failed to retrieve featured section:", error);
    return NextResponse.json({ error: "Failed to retrieve featured section" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = featuredSectionConfigSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const actor = session.user?.email || session.user?.id || "admin";
    const updated = await updateAdminFeaturedSection(parsed.data, actor);

    return NextResponse.json({
      success: true,
      message: "Featured Highlights section updated successfully",
      featuredSection: updated,
    });
  } catch (error) {
    console.error("[API Error] Failed to update featured section:", error);
    return NextResponse.json({ error: "Failed to update featured section" }, { status: 500 });
  }
}
