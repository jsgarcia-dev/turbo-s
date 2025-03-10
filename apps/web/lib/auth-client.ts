import { customSessionClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { auth } from "@/lib/auth";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
  plugins: [customSessionClient<typeof auth>()],
});

export const { signIn, signUp, signOut, useSession } = createAuthClient();
