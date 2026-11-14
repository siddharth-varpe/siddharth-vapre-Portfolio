import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/server/auth/session";
import {
  getAdminFooterSection,
  updateAdminFooterSection,
} from "@/lib/server/db/repositories/admin";
import { footerSectionConfigSchema } from "@/lib/validations/models";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await requireAdminSession({ isApi: true });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const config = await getAdminFooterSection();
    return NextResponse.json({ success: true, data: config });
  } catch (error) {
    console.error("[Admin Footer GET Error]:", error);
    return NextResponse.json(
      { error: "Failed to retrieve Footer section configuration" },
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
    const parsed = footerSectionConfigSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const updated = await updateAdminFooterSection(
      parsed.data,
      session.user.name || session.user.email || "admin"
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("[Admin Footer PUT Error]:", error);
    return NextResponse.json(
      { error: "Failed to update Footer section configuration" },
      { status: 500 }
    );
  }
}
