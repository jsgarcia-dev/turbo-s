"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@repo/database";

/**
 * Recupera informações sobre os provedores de autenticação do usuário atual
 * Server Action use em server components
 * @returns Objeto com detalhes sobre os provedores de autenticação do usuário
 */
export async function getUserAuthProviders() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      hasSession: false,
      providers: [],
      oauthProviders: [],
      hasCredential: false,
      hasOAuth: false,
      hasGoogle: false,
      user: null,
    };
  }

  try {
    const accounts = await prisma.account.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        providerId: true,
      },
    });

    const providers = accounts.map((account) => account.providerId);
    const oauthProviders = providers.filter((p) => p !== "credential");

    return {
      hasSession: true,
      userId: session.user.id,
      providers,
      oauthProviders,
      hasCredential: providers.includes("credential"),
      hasOAuth: providers.some((p) => p !== "credential"),
      hasGoogle: providers.includes("google"),
      user: session.user,
    };
  } catch (error) {
    console.error("Erro ao consultar provedores do usuário:", error);
    return {
      hasSession: true,
      userId: session.user.id,
      providers: [],
      oauthProviders: [],
      hasCredential: false,
      hasOAuth: false,
      hasGoogle: false,
      user: session.user,
    };
  }
}
