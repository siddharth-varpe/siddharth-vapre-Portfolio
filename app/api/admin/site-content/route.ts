import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/server/auth/session";
import { getAdminSiteContent, updateAdminSiteContent } from "@/lib/server/db";
import { siteContentMutationSchema } from "@/lib/validations/models";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await requireAdminSession({ isApi: true });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const siteContent = await getAdminSiteContent();
    return NextResponse.json({ success: true, data: siteContent });
  } catch (error) {
    console.error("[Admin Site Content GET Error]:", error);
    return NextResponse.json({ error: "Failed to retrieve site content" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await requireAdminSession({ isApi: true });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = siteContentMutationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const updated = await updateAdminSiteContent(
      parsed.data,
      session.user.name || session.user.email || "admin"
    );
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("[Admin Site Content PUT Error]:", error);
    return NextResponse.json({ error: "Failed to update site content" }, { status: 500 });
  }
}
