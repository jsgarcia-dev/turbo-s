"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@repo/database";

export async function getUserAuthProviders() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { hasSession: false, providers: [] };
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

    return {
      hasSession: true,
      userId: session.user.id,
      providers,
      hasCredential: providers.includes("credential"),
      hasOAuth: providers.some((p) => p !== "credential"),
    };
  } catch (error) {
    console.error("Erro ao consultar provedores do usuário:", error);
    return {
      hasSession: true,
      providers: [],
      hasCredential: false,
      hasOAuth: false,
    };
  }
}
