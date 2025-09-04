import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const protectedPaths = ['/order', '/checkout', '/account'];

  const isPuckEditorRoute = req.nextUrl.pathname.startsWith("/puck");
  const isEditRoute = req.nextUrl.pathname.endsWith("/edit");

  console.log(isPuckEditorRoute);
  console.log(isEditRoute);

  if (protectedPaths.some(path => req.nextUrl.pathname.startsWith(path)) || isPuckEditorRoute || isEditRoute) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    console.log(token);

    // Redirect to signin if user is not logged in
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = '/signin';
      // Add a callbackUrl so the user is redirected back to the page they were trying to access
      url.searchParams.set('callbackUrl', req.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    if((isPuckEditorRoute || isEditRoute) && token.role != 'Admin') {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
  

  if (req.method === "GET") {
    // Rewrite routes that match "/[...puckPath]/edit" to "/puck/[...puckPath]"
    if (req.nextUrl.pathname.endsWith("/edit")) {
      const pathWithoutEdit = req.nextUrl.pathname.slice(
        0,
        req.nextUrl.pathname.length - 5
      );
      const pathWithEditPrefix = `/puck${pathWithoutEdit}`;

      return NextResponse.rewrite(new URL(pathWithEditPrefix, req.url));
    }

    // Disable "/puck/[...puckPath]"
    if (req.nextUrl.pathname.startsWith("/puck")) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Exclude all internal paths and files from middleware processing.
     * The regex matches all paths that do NOT start with:
     * - _next (Next.js internals)
     * - api (API routes)
     * - .well-known (Standard web paths)
     * - A dot (for static files like favicon.ico, images, etc.)
     */
    "/((?!_next|api|.well-known|.*\\..*).*)",
  ],
};