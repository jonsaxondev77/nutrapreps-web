import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  
  // Construct the Content-Security-Policy header
  const cspHeader = `
    frame-ancestors 'self';
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-eval' https://checkout.stripe.com;
    style-src 'self' https://nutrapreps.b-cdn.net 'unsafe-inline';
    img-src 'self' https://*.stripe.com https://nutrapreps.b-cdn.net https://images.unsplash.com https://placehold.co;
    connect-src 'self' https://checkout.stripe.com https://ukwest-0.in.applicationinsights.azure.com https://js.monitor.azure.com;
    frame-src 'self' https://checkout.stripe.com;
    font-src 'self' data:;
    media-src 'self' https://nutrapreps.b-cdn.net;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
  `;
  
  const res = NextResponse.next();
  res.headers.set('Content-Security-Policy', cspHeader.replace(/\s{2,}/g, ' ').trim());
  res.headers.set('x-nonce', nonce);
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');

  const protectedPaths = ['/order', '/checkout', '/account', '/cart'];
  const isPuckEditorRoute = req.nextUrl.pathname.startsWith("/puck");
  const isEditRoute = req.nextUrl.pathname.endsWith("/edit");

  if (protectedPaths.some(path => req.nextUrl.pathname.startsWith(path)) || isPuckEditorRoute || isEditRoute) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = '/signin';

      const sanitizedCallbackUrl = new URL(req.nextUrl.pathname, req.nextUrl.origin).pathname;
      url.searchParams.set('callbackUrl', sanitizedCallbackUrl);

      url.searchParams.set('callbackUrl', req.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    if((isPuckEditorRoute || isEditRoute) && token.role != 'Admin') {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
  

  if (req.method === "GET") {
    if (req.nextUrl.pathname.endsWith("/edit")) {
      const pathWithoutEdit = req.nextUrl.pathname.slice(
        0,
        req.nextUrl.pathname.length - 5
      );
      const pathWithEditPrefix = `/puck${pathWithoutEdit}`;
      return NextResponse.rewrite(new URL(pathWithEditPrefix, req.url));
    }

    if (req.nextUrl.pathname.startsWith("/puck")) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!_next|api|.well-known|.*\\..*).*)",
  ],
};