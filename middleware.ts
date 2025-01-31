import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const origin = request.headers.get("origin") || "";

  // Check if user is authenticated by looking for the auth token
  const authToken = request.cookies.get("next-auth.session-token");

  // If user is not authenticated and trying to access protected routes, redirect to login
  if (!authToken && request.nextUrl.pathname === "/calendar") {
    return NextResponse.redirect(new URL("/login", request.url));
  } else if (
    authToken &&
    (request.nextUrl.pathname === "/login" ||
      request.nextUrl.pathname === "/signup")
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  } else if (!authToken && request.nextUrl.pathname === "/change-password") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Check if the request is from your Chrome extension
  const isExtensionRequest = origin.startsWith("chrome-extension://");

  // Handle preflight requests
  if (request.method === "OPTIONS") {
    const response = new NextResponse(null, { status: 200 });

    if (isExtensionRequest) {
      response.headers.set("Access-Control-Allow-Origin", origin);
      response.headers.set(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
      );
      response.headers.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, Cookie"
      );
      response.headers.set("Access-Control-Allow-Credentials", "true");
      response.headers.set("Access-Control-Max-Age", "86400"); // 24 hours
    }

    return response;
  }

  // Handle actual requests
  const response = NextResponse.next();

  if (isExtensionRequest) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, Cookie"
    );
    response.headers.set("Access-Control-Allow-Credentials", "true");
  }

  return response;
}

export const config = {
  matcher: [
    "/api/:path*",
    "/login",
    "/signup",
    "/change-password",
    "/calendar",
  ],
};
