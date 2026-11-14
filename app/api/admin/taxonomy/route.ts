import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/server/auth/session";
import { getAdminTechnicalTaxonomy, updateAdminTechnicalTaxonomy } from "@/lib/server/db";
import { technicalTaxonomyConfigSchema } from "@/lib/validations/models";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const technicalTaxonomy = await getAdminTechnicalTaxonomy();
    return NextResponse.json({ technicalTaxonomy });
  } catch (error) {
    console.error("[API Error] Failed to retrieve technical taxonomy:", error);
    return NextResponse.json({ error: "Failed to retrieve technical taxonomy" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = technicalTaxonomyConfigSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const actor = session.user?.email || session.user?.id || "admin";
    const updated = await updateAdminTechnicalTaxonomy(parsed.data, actor);

    return NextResponse.json({
      success: true,
      message: "Technical Taxonomy section updated successfully",
      technicalTaxonomy: updated,
    });
  } catch (error) {
    console.error("[API Error] Failed to update technical taxonomy:", error);
    return NextResponse.json({ error: "Failed to update technical taxonomy" }, { status: 500 });
  }
}
