import { clerkMiddleware, createRouteMatcher } from "@clerk/astro/server";

const isProtectedRoute = createRouteMatcher(["/admin(.*)"]);

export const requireAdminLogin = clerkMiddleware((auth, context, next) => {
	context.locals.auth = auth;

	const { redirectToSignIn, userId } = auth();

	if (!userId && isProtectedRoute(context.request)) {
		return redirectToSignIn();
	}

	return next();
});
