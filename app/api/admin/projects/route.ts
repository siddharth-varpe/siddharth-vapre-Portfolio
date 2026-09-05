import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/server/auth/session";
import { getAdminProjects, createAdminProject } from "@/lib/server/db";
import { projectMutationSchema } from "@/lib/validations/models";
import type { ContentStatus } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const session = await requireAdminSession({ isApi: true });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const limit = parseInt(searchParams.get("limit") ?? "20", 10);
    const status = searchParams.get("status") as ContentStatus | null;
    const search = searchParams.get("search") ?? undefined;

    const result = await getAdminProjects({
      page,
      limit,
      status: status ?? undefined,
      search,
    });
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("[Admin Projects GET Error]:", error);
    return NextResponse.json({ error: "Failed to retrieve projects" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await requireAdminSession({ isApi: true });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = projectMutationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const created = await createAdminProject(
      parsed.data,
      session.user.name || session.user.email || "admin"
    );
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error("[Admin Projects POST Error]:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
