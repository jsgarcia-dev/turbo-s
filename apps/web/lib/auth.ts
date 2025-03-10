import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@repo/database";
import { bearer, jwt } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { customSession } from "better-auth/plugins";
import { findUserRoles } from "@/services/find-user-roles";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache for 5 minutes (in seconds)
    },
  },

  // Providers
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  user: {
    changeEmail: {
      enabled: true,
    },
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "USER",
        input: false,
      },
    },
  },
  // Plugins
  plugins: [
    customSession(async ({ user, session }) => {
      const roles = await findUserRoles(session.userId);
      return {
        user: {
          ...user,
          role: roles,
        },
        session,
      };
    }),
    jwt({
      jwks: {
        keyPairConfig: {
          alg: "ES256", // Mudando de EdDSA para ES256 para compatibilidade com o Passport/jwt
        },
      },
      jwt: {
        expirationTime: "7d",
        issuer: process.env.NEXT_PUBLIC_URL,
        audience: process.env.NEXT_PUBLIC_URL,
      },
    }),
    bearer(),
    nextCookies(),
  ],

  // Logger
  logger: {
    level: "debug",
  },
});
