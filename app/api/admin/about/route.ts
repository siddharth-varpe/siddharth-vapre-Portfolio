import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/server/auth/session";
import { getAdminAbout, updateAdminAbout } from "@/lib/server/db";
import { aboutMutationSchema } from "@/lib/validations/models";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await requireAdminSession({ isApi: true });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const about = await getAdminAbout();
    return NextResponse.json({ success: true, data: about });
  } catch (error) {
    console.error("[Admin About GET Error]:", error);
    return NextResponse.json({ error: "Failed to retrieve about section" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await requireAdminSession({ isApi: true });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = aboutMutationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const updated = await updateAdminAbout(
      parsed.data,
      session.user.name || session.user.email || "admin"
    );
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("[Admin About PUT Error]:", error);
    return NextResponse.json({ error: "Failed to update about section" }, { status: 500 });
  }
}
