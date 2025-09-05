"use client";

import { type Preloaded, usePreloadedQuery } from "convex/react";
import type { api } from "@/convex/_generated/api";
import { withConvex } from "@/lib/convex";

// ROOT ************************************************************************************************************************************
export const UserEmail = withConvex(({ preloaded }: UserEmailProps) => {
	const email = usePreloadedQuery(preloaded);
	return <div>Email : {email}</div>;
});
type UserEmailProps = { preloaded: Preloaded<typeof api.auth.getUserEmail> };
