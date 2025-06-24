import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoutes = createRouteMatcher(["/", "/settings(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoutes(req)) {
    try {
      const { userId } = await auth();
      
      if (!userId) {
        // Manual redirect instead of auth.protect()
        const signInUrl = new URL('/sign-in', req.url);
        signInUrl.searchParams.set('redirect_url', req.url);
        return NextResponse.redirect(signInUrl);
      }
    } catch (error) {
      // Handle the NEXT_REDIRECT error gracefully
      if (error && typeof error === 'object' && 'digest' in error) {
        const digest = (error as any).digest;
        if (typeof digest === 'string' && digest.includes('NEXT_REDIRECT')) {
          // Extract redirect URL from digest
          const parts = digest.split(';');
          if (parts.length >= 3) {
            const redirectUrl = parts[2];
            return NextResponse.redirect(redirectUrl);
          }
        }
      }
      
      // Fallback redirect
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next|sign-in|sign-up|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};