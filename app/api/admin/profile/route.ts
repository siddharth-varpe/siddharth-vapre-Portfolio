import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/server/auth/session";
import { getAdminProfile, updateAdminProfile } from "@/lib/server/db";
import { profileMutationSchema } from "@/lib/validations/models";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await requireAdminSession({ isApi: true });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const profile = await getAdminProfile();
    return NextResponse.json({ success: true, data: profile });
  } catch (error) {
    console.error("[Admin Profile GET Error]:", error);
    return NextResponse.json({ error: "Failed to retrieve profile" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await requireAdminSession({ isApi: true });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = profileMutationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const updated = await updateAdminProfile(
      parsed.data,
      session.user.name || session.user.email || "admin"
    );
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("[Admin Profile PUT Error]:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
