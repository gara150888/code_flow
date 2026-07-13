import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { env } from "@/env";
import { db } from "@/server/db";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),

  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,

  emailAndPassword: {
    enabled: true,
  },

  pages: {
    signIn: "/login",
  },

  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },

    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
});

export const getSession = async () =>
  auth.api.getSession({
    headers: await headers(),
  });

export function redirectToLogin(
  currentPath: string,
  searchParams?: Record<string, string | string[] | undefined>,
): never {
  let fullPath = currentPath;

  if (searchParams) {
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(searchParams)) {
      if (value === undefined) continue;

      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v));
      } else {
        params.set(key, value);
      }
    }

    const qs = params.toString();
    if (qs) fullPath += `?${qs}`;
  }

  redirect(`/login?returnTo=${encodeURIComponent(fullPath)}`);
}
