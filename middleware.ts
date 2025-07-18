import authConfig from "./auth.config"
import NextAuth, {Session} from "next-auth";
import {publicRoutes, authRoute, skipAuthPrefixes, default_login_redirect} from "@/routes"
import { NextRequest } from "next/server";
const { auth } = NextAuth(authConfig)

function isRouteStartsWithPrefixes(pathname: string, prefixes: string[]) {
	return prefixes.some((prefix) => pathname.startsWith(prefix))
  }

export default auth((req: NextRequest & { auth: Session | null }): Response | void => {
	const {nextUrl} = req
	const isLogin = !!req.auth	
	const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
	const isAuthRoute = authRoute.includes(nextUrl.pathname);

  // ✅ Nếu là route cần skip (API auth, download, ...), thì cho qua
	if (isRouteStartsWithPrefixes(nextUrl.pathname, skipAuthPrefixes)) {
		return
	}
	if(isAuthRoute){
		if(isLogin){
			return Response.redirect(new URL(default_login_redirect, nextUrl));
		}
		return;
	}
	if(!isLogin && !isPublicRoute){
		return Response.redirect(new URL("/auth/login", nextUrl));
	}
	return;

})

 
// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}