import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { api } from "@/convex/_generated/api";
import { deleteCookies, getToken, setCookies } from "@/lib/auth/utils";

export const server = {
	signIn: defineAction({
		accept: "form",
		input: z.object({ email: z.string(), password: z.string() }),
		handler: async (input, { locals: { convex }, cookies }) => {
			try {
				const cookieHeader = await convex.fetchMutation(api.auth.signIn, input);
				return setCookies(cookies, cookieHeader);
			} catch (error) {
				console.error(error);
				throw new ActionError({ code: "BAD_REQUEST", message: "Unknown error" });
			}
		},
	}),
	signOut: defineAction({
		accept: "form",
		handler: async (_, { cookies, locals: { convex } }) => {
			const token = await getToken(cookies);
			await convex.fetchMutation(api.auth.signOut, {}, { token });
			return deleteCookies(cookies);
		},
	}),
};
