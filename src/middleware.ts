import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define public routes that don't require authentication
const publicRoutes = [
    "/sign-in",
    "/sign-up",
    "/api/auth/login",
    "/api/auth/register",
];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if the route is public
    if (publicRoutes.some(route =>
        pathname === route ||
        (route.endsWith('*') && pathname.startsWith(route.slice(0, -1)))
    )) {
        return NextResponse.next();
    }

    // Check API routes - they should handle their own auth
    if (pathname.startsWith('/api/')) {
        return NextResponse.next();
    }

    // Check static files routes
    if (pathname.match(/\.(css|js|jpg|jpeg|png|gif|svg|ico|json)$/)) {
        return NextResponse.next();
    }

    // Check if the user is authenticated by checking for the auth token cookie
    const authToken = request.cookies.get("auth_token");

    // If no token exists, redirect to login
    if (!authToken) {
        const url = request.nextUrl.clone();
        url.pathname = "/sign-in";

        // Save the attempted URL for later redirect after login
        url.searchParams.set("redirect", pathname);

        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

// Configure Middleware Matcher
export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};