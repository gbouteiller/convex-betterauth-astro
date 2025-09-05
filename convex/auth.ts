import { type AuthFunctions, BetterAuth, type PublicAuthFunctions } from "@convex-dev/better-auth";
import { v } from "convex/values";
import { createAuth } from "../src/lib/auth/server";
import { api, components, internal } from "./_generated/api";
import type { DataModel, Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

// Typesafe way to pass Convex functions defined in this file
const authFunctions: AuthFunctions = internal.auth;
const publicAuthFunctions: PublicAuthFunctions = api.auth;

// Initialize the component
export const betterAuthComponent = new BetterAuth(components.betterAuth, {
	authFunctions,
	publicAuthFunctions,
});

// These are required named exports
export const { createUser, updateUser, deleteUser, createSession, isAuthenticated } = betterAuthComponent.createAuthFunctions<DataModel>({
	// Must create a user and return the user id
	onCreateUser: async (ctx, user) => {
		return ctx.db.insert("users", {});
	},

	// Delete the user when they are deleted from Better Auth
	onDeleteUser: async (ctx, userId) => {
		await ctx.db.delete(userId as Id<"users">);
	},
});

// Example function for getting the current user
// Feel free to edit, omit, etc.
export const getCurrentUser = query({
	args: {},
	handler: async (ctx) => {
		// Get user data from Better Auth - email, name, image, etc.
		const userMetadata = await betterAuthComponent.getAuthUser(ctx);
		if (!userMetadata) {
			return null;
		}
		// Get user data from your application's database
		// (skip this if you have no fields in your users table schema)
		const user = await ctx.db.get(userMetadata.userId as Id<"users">);
		return {
			...user,
			...userMetadata,
		};
	},
});

export const getUserEmail = query({
	handler: async (ctx) => {
		const identity = await ctx.auth.getUserIdentity();
		return identity?.email;
	},
});

export const signIn = mutation({
	args: { email: v.string(), password: v.string() },
	handler: async (ctx, { email, password }) => {
		console.log("signIn: ", { email, password });
		const auth = createAuth(ctx);
		const response = await auth.api.signInEmail({ body: { email, password }, asResponse: true });
		return response.headers.get("set-cookie");
	},
});

export const signOut = mutation({
	args: {},
	handler: async (ctx) => {
		const auth = createAuth(ctx);
		const headers = await betterAuthComponent.getHeaders(ctx);
		const { success } = await auth.api.signOut({ headers });
		return success;
	},
});

export const getSession = query({
	args: {},
	handler: async (ctx) => {
		const auth = createAuth(ctx);
		const headers = await betterAuthComponent.getHeaders(ctx);
		const session = await auth.api.getSession({ headers });
		const user1 = await ctx.auth.getUserIdentity();
		const user2 = await betterAuthComponent.getAuthUser(ctx);
		return { session, user1, user2 };
	},
});
