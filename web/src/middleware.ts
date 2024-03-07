import { auth } from "@/auth";

import {
    DEFAULT_LOGIN_REDIRECT,
    apiAuthPrefix,
    authRoutes,
    publicRoutes,
} from "@/routes";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    // return null;
    const session = await auth();

    let { nextUrl } = request;
    const isLoggedIn = session != null;
    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);

    let fixedRoute = nextUrl.pathname;

    const isPublicRoute = publicRoutes.includes(fixedRoute);
    const isAuthRoute = authRoutes.includes(fixedRoute);

    if (fixedRoute == "/") {
        console.log("/ssss");
        return NextResponse.redirect(
            new URL(`${DEFAULT_LOGIN_REDIRECT}`, nextUrl)
        );
    }

    if (isApiAuthRoute) {
        return null;
    }

    if (isAuthRoute) {
        console.log("/1222222222222");

        if (isLoggedIn) {
            return NextResponse.redirect(
                new URL(`/${DEFAULT_LOGIN_REDIRECT}`, nextUrl)
            );
        }
    }

    if (!isLoggedIn && !isPublicRoute && !isAuthRoute) {
        console.log("/432442");

        let callbackUrl = nextUrl.pathname;
        if (nextUrl.search) {
            callbackUrl += nextUrl.search;
        }

        const encodedCallbackUrl = encodeURIComponent(callbackUrl);
        return NextResponse.redirect(
            new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
        );
    }

    return null;
}

// Optionally, don't invoke Middleware on some paths
export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
