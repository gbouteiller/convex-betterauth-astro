import { PUBLIC_CONVEX_URL } from "astro:env/client";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { ConvexReactClient } from "convex/react";
import type { JSX } from "react";
import { authClient } from "./auth/client";

const client = new ConvexReactClient(PUBLIC_CONVEX_URL, { expectAuth: true });

export function withConvex<Props extends JSX.IntrinsicAttributes>(Component: React.ComponentType<Props>) {
	return function WithConvexProvider(props: Props) {
		return (
			<ConvexBetterAuthProvider client={client} authClient={authClient}>
				<Component {...props} />
			</ConvexBetterAuthProvider>
		);
	};
}
