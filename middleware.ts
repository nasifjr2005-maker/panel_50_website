import { NextResponse, type NextRequest } from "next/server";

const sessionCookieName = "panel50_admin_session";

async function sign(value: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return Array.from(new Uint8Array(signature)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function verifySession(value?: string) {
  if (!value) {
    return false;
  }

  const parts = value.split(".");
  if (parts.length !== 4) {
    return false;
  }

  const payload = `${parts[0]}.${parts[1]}.${parts[2]}`;
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "panel50-dev-secret";
  const expected = await sign(payload, secret);
  return expected === parts[3] && Number(parts[1]) > Date.now();
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname === "/admin/login";
  const isAdminApi = pathname.startsWith("/api/admin");

  if (!isAdminRoute && !isAdminApi) {
    return NextResponse.next();
  }

  const isAuthed = await verifySession(request.cookies.get(sessionCookieName)?.value);

  if (isLoginRoute && isAuthed) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if ((isAdminRoute && !isLoginRoute && !isAuthed) || (isAdminApi && !isAuthed && pathname !== "/api/admin/login")) {
    if (isAdminApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const response = NextResponse.next();
  if (isAdminRoute) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"]
};
