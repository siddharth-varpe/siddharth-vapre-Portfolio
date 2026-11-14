import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/server/auth/session";
import {
  getAdminDistinctionsSection,
  updateAdminDistinctionsSection,
} from "@/lib/server/db/repositories/admin";
import { distinctionsSectionConfigSchema } from "@/lib/validations/models";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await requireAdminSession({ isApi: true });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const config = await getAdminDistinctionsSection();
    return NextResponse.json({ success: true, data: config });
  } catch (error) {
    console.error("[Admin Distinctions GET Error]:", error);
    return NextResponse.json(
      { error: "Failed to retrieve Verified Distinctions section configuration" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  const session = await requireAdminSession({ isApi: true });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = distinctionsSectionConfigSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const updated = await updateAdminDistinctionsSection(
      parsed.data,
      session.user.name || session.user.email || "admin"
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("[Admin Distinctions PUT Error]:", error);
    return NextResponse.json(
      { error: "Failed to update Verified Distinctions section configuration" },
      { status: 500 }
    );
  }
}
