import { httpRouter } from "convex/server";
import { createAuth } from "../src/lib/auth/server";
import { betterAuthComponent } from "./auth";

const http = httpRouter();

betterAuthComponent.registerRoutes(http, createAuth);

export default http;
