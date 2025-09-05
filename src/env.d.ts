import type { ConvexHttpClient } from "convex/browser";
import type { Preloaded } from "convex/react";
import type { FunctionReference, FunctionReturnType } from "convex/server";

declare global {
	declare namespace App {
		interface Locals {
			auth: {
				getToken: () => Promise<string | undefined>;
			};
			convex: {
				client: ConvexHttpClient;
				fetchMutation: <M extends FunctionReference<"mutation">>(
					mutation: M,
					...args: ArgsAndOptions<M, { token?: string }>
				) => Promise<FunctionReturnType<M>>;
				fetchQuery: <Q extends FunctionReference<"query">>(
					query: Q,
					...args: ArgsAndOptions<Q, { token?: string }>
				) => Promise<Preloaded<Q>>;
				preloadQuery: <Q extends FunctionReference<"query">>(
					query: Q,
					...args: ArgsAndOptions<Q, { token?: string }>
				) => Promise<FunctionReturnType<Q>>;
			};
		}
	}
}
