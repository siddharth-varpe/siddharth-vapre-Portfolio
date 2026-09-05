import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/server/auth/session";
import { getAdminMedia, createAdminMedia } from "@/lib/server/db";
import { mediaMetadataMutationSchema } from "@/lib/validations/models";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await requireAdminSession({ isApi: true });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const media = await getAdminMedia();
    return NextResponse.json({ success: true, data: media });
  } catch (error) {
    console.error("[Admin Media GET Error]:", error);
    return NextResponse.json({ error: "Failed to retrieve media library metadata" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await requireAdminSession({ isApi: true });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = mediaMetadataMutationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const created = await createAdminMedia(
      parsed.data,
      session.user.name || session.user.email || "admin"
    );
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error("[Admin Media POST Error]:", error);
    return NextResponse.json({ error: "Failed to create media metadata" }, { status: 500 });
  }
}
