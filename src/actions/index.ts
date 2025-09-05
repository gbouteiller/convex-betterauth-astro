import { defineAction } from "astro:actions";
import { z } from "astro:schema";

export const server = {
	signIn: defineAction({
		accept: "form",
		input: z.object({ email: z.string(), password: z.string() }),
		handler: async (input) => {
			console.log("ACTION - signIn: ", input);
			return true;
			// try {
			// 	// const cookieHeader = await convex.fetchMutation(api.auth.signIn, input);
			// 	// return setCookies(cookies, cookieHeader);
			// 	return true;
			// } catch (error) {
			// 	console.error(error);
			// 	throw new ActionError({ code: "BAD_REQUEST", message: "Unknown error" });
			// }
		},
	}),
	signOut: defineAction({
		accept: "form",
		handler: async () => {
			// const token = await getToken(cookies);
			// await convex.fetchMutation(api.auth.signOut, {}, { token });
			// return deleteCookies(cookies);
			return true;
		},
	}),
};
