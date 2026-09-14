import { auth } from "@/lib/server/auth";
import { ensureBootstrapAdmin } from "@/lib/server/auth/bootstrap";
import { toNextJsHandler } from "better-auth/next-js";
import { NextResponse } from "next/server";

const rawHandlers = toNextJsHandler(auth);

function normalizeAuthRequest(request: Request): Request {
  if (request.headers.get("origin")) {
    return request;
  }
  const fallbackOrigin = request.headers.get("referer")
    ? new URL(request.headers.get("referer")!).origin
    : new URL(request.url).origin;

  const headers = new Headers(request.headers);
  headers.set("origin", fallbackOrigin);

  return new Request(request.url, {
    method: request.method,
    headers,
    body: request.body,
    // @ts-expect-error duplex required for streaming request body in Node Fetch
    duplex: "half",
  });
}

export async function GET(request: Request) {
  try {
    await ensureBootstrapAdmin();
    return await rawHandlers.GET(normalizeAuthRequest(request));
  } catch (err: unknown) {
    console.error("[Auth API GET Error]:", err);
    return NextResponse.json(
      { error: "Authentication service error", details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await ensureBootstrapAdmin();
    return await rawHandlers.POST(normalizeAuthRequest(request));
  } catch (err: unknown) {
    console.error("[Auth API POST Error]:", err);
    return NextResponse.json(
      { error: "Authentication service error", details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

