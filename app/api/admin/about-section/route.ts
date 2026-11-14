import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/server/auth/session";
import {
  getAdminAboutSection,
  updateAdminAboutSection,
} from "@/lib/server/db/repositories/admin";
import { aboutSectionConfigSchema } from "@/lib/validations/models";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await requireAdminSession({ isApi: true });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const config = await getAdminAboutSection();
    return NextResponse.json({ success: true, data: config });
  } catch (error) {
    console.error("[Admin About Section GET Error]:", error);
    return NextResponse.json(
      { error: "Failed to retrieve About section configuration" },
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
    const parsed = aboutSectionConfigSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const updated = await updateAdminAboutSection(
      parsed.data,
      session.user.name || session.user.email || "admin"
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("[Admin About Section PUT Error]:", error);
    return NextResponse.json(
      { error: "Failed to update About section configuration" },
      { status: 500 }
    );
  }
}
