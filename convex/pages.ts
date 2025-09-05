import { query } from "./_generated/server";

export const home = query({
	args: {},
	handler: async () => "Home",
});
