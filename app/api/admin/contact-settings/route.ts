import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/server/auth/session";
import { getAdminContactSettings, updateAdminContactSettings } from "@/lib/server/db";
import { contactSettingsMutationSchema } from "@/lib/validations/models";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await requireAdminSession({ isApi: true });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const settings = await getAdminContactSettings();
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error("[Admin Contact Settings GET Error]:", error);
    return NextResponse.json({ error: "Failed to retrieve contact settings" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await requireAdminSession({ isApi: true });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = contactSettingsMutationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const updated = await updateAdminContactSettings(
      parsed.data,
      session.user.name || session.user.email || "admin"
    );
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("[Admin Contact Settings PUT Error]:", error);
    return NextResponse.json({ error: "Failed to update contact settings" }, { status: 500 });
  }
}
