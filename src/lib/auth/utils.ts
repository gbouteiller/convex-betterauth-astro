import { JWT_COOKIE_NAME } from "@convex-dev/better-auth/plugins";
import type { AstroCookies } from "astro";
import { createCookieGetter, getCookies, parseSetCookieHeader } from "better-auth/cookies";
import { createAuth } from "./server";

export function authOptions() {
	return createAuth({} as any).options;
}

export function createCookie(name: string) {
	return createCookieGetter(authOptions())(name);
}

export async function deleteCookies(cookies: AstroCookies) {
	const jwtCookieName = createCookie(JWT_COOKIE_NAME).name;
	const sessionCookieName = getCookies(authOptions()).sessionToken.name;
	cookies.delete(jwtCookieName);
	cookies.delete(sessionCookieName);
	return true;
}

export function setCookies(cookies: AstroCookies, cookieHeader: string | null) {
	if (!cookieHeader) return false;
	const parsed = parseSetCookieHeader(cookieHeader);
	parsed.forEach((value, key) => {
		if (!key) return;
		const opts = {
			sameSite: value.samesite,
			secure: value.secure,
			maxAge: value["max-age"],
			httpOnly: value.httponly,
			domain: value.domain,
			path: value.path,
		} as const;
		cookies.set(key, decodeURIComponent(value.value), opts);
	});
	return true;
}

export const getToken = async (cookies: AstroCookies) => {
	const cookie = createCookie(JWT_COOKIE_NAME);
	const tokenCookie = cookies.get(cookie.name);

	// Warn if there's a secure cookie mismatch between Convex and Astro
	if (!tokenCookie?.value) {
		const isSecure = cookie.name.startsWith("__Secure-");
		const insecureCookieName = cookie.name.replace("__Secure-", "");
		const insecureCookie = cookies.get(insecureCookieName);
		const secureCookieName = isSecure ? cookie.name : `__Secure-${insecureCookieName}`;
		const secureCookie = cookies.get(secureCookieName);
		if (isSecure && insecureCookie)
			console.warn(`Looking for secure cookie ${cookie.name} but found insecure cookie ${insecureCookie.value}`);
		if (!isSecure && secureCookie) console.warn(`Looking for insecure cookie ${cookie.name} but found secure cookie ${secureCookie.value}`);
	}
	return tokenCookie?.value;
};
