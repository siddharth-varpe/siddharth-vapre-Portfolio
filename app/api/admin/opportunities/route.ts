import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/server/auth/session";
import {
  getAdminOpportunitiesSection,
  updateAdminOpportunitiesSection,
} from "@/lib/server/db/repositories/admin";
import { opportunitiesSectionConfigSchema } from "@/lib/validations/models";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await requireAdminSession({ isApi: true });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const config = await getAdminOpportunitiesSection();
    return NextResponse.json({ success: true, data: config });
  } catch (error) {
    console.error("[Admin Opportunities GET Error]:", error);
    return NextResponse.json(
      { error: "Failed to retrieve Open For Opportunities section configuration" },
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
    const parsed = opportunitiesSectionConfigSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const updated = await updateAdminOpportunitiesSection(
      parsed.data,
      session.user.name || session.user.email || "admin"
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("[Admin Opportunities PUT Error]:", error);
    return NextResponse.json(
      { error: "Failed to update Open For Opportunities section configuration" },
      { status: 500 }
    );
  }
}
