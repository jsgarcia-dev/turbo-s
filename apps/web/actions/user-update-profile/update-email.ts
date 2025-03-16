"use server";

import { auth } from "@/lib/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

const updateEmailSchema = z.object({
  newEmail: z.string().email("Email inválido"),
});

export async function updateUserEmail(formData: FormData) {
  try {
    const newEmail = formData.get("newEmail") as string;
    const callbackURL =
      (formData.get("callbackURL") as string) || "/user-profile";

    const result = updateEmailSchema.safeParse({ newEmail });

    if (!result.success) {
      return {
        success: false,
        error: result.error.flatten().fieldErrors,
      };
    }

    // Obter a sessão do usuário atual
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return {
        success: false,
        error: { auth: ["Usuário não autenticado"] },
      };
    }

    // Atualizar o email do usuário usando a API do Better Auth
    await auth.api.changeEmail({
      body: {
        newEmail: result.data.newEmail,
        callbackURL,
      },
      headers: await headers(),
    });

    // Revalidar caminhos relevantes
    revalidatePath("/settings/user-profile");

    return {
      success: true,
      message:
        "Solicitação de alteração de email enviada. Confira sua caixa de entrada para confirmar.",
    };
  } catch (error) {
    console.error("Erro ao atualizar email:", error);
    return {
      success: false,
      error: { server: ["Erro ao processar alteração de email"] },
    };
  }
}
