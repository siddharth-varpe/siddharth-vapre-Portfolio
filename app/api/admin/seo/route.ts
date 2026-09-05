import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/server/auth/session";
import { getAdminSeo, updateAdminSeo } from "@/lib/server/db";
import { seoMetadataMutationSchema } from "@/lib/validations/models";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await requireAdminSession({ isApi: true });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const seo = await getAdminSeo();
    return NextResponse.json({ success: true, data: seo });
  } catch (error) {
    console.error("[Admin SEO GET Error]:", error);
    return NextResponse.json({ error: "Failed to retrieve SEO metadata" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await requireAdminSession({ isApi: true });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = seoMetadataMutationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const updated = await updateAdminSeo(
      parsed.data,
      session.user.name || session.user.email || "admin"
    );
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("[Admin SEO PUT Error]:", error);
    return NextResponse.json({ error: "Failed to update SEO metadata" }, { status: 500 });
  }
}
