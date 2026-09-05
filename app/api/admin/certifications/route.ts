import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/server/auth/session";
import { getAdminCertifications, createAdminCertification } from "@/lib/server/db";
import { certificationMutationSchema } from "@/lib/validations/models";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await requireAdminSession({ isApi: true });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const certifications = await getAdminCertifications();
    return NextResponse.json({ success: true, data: certifications });
  } catch (error) {
    console.error("[Admin Certifications GET Error]:", error);
    return NextResponse.json({ error: "Failed to retrieve certifications" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await requireAdminSession({ isApi: true });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = certificationMutationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const created = await createAdminCertification(
      parsed.data,
      session.user.name || session.user.email || "admin"
    );
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error("[Admin Certifications POST Error]:", error);
    return NextResponse.json({ error: "Failed to create certification" }, { status: 500 });
  }
}
