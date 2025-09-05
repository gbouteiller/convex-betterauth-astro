import { PUBLIC_CONVEX_SITE_URL } from "astro:env/client";
import type { APIRoute } from "astro";

export const ALL: APIRoute = async ({ request }) => {
	const { pathname, search } = new URL(request.url);
	const newRequest = new Request(`${PUBLIC_CONVEX_SITE_URL}${pathname}${search}`, request);
	newRequest.headers.set("accept-encoding", "application/json");
	return fetch(newRequest, { method: request.method, redirect: "manual" });
};
