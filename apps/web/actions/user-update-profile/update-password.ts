"use server";

import { auth } from "@/lib/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

const updatePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, "A senha atual deve ter pelo menos 8 caracteres"),
    newPassword: z
      .string()
      .min(8, "A nova senha deve ter pelo menos 8 caracteres"),
    confirmPassword: z
      .string()
      .min(8, "A confirmação de senha deve ter pelo menos 8 caracteres"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não conferem",
    path: ["confirmPassword"],
  });

export async function updateUserPassword(formData: FormData) {
  try {
    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    const result = updatePasswordSchema.safeParse({
      currentPassword,
      newPassword,
      confirmPassword,
    });

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

    // Atualizar a senha do usuário usando a API do Better Auth
    await auth.api.changePassword({
      body: {
        currentPassword: result.data.currentPassword,
        newPassword: result.data.newPassword,
      },
      headers: await headers(),
    });

    // Revalidar caminhos relevantes
    revalidatePath("/settings");

    return {
      success: true,
      message: "Senha atualizada com sucesso",
    };
  } catch (error) {
    console.error("Erro ao atualizar senha:", error);
    return {
      success: false,
      error: { server: ["Erro ao atualizar senha do usuário"] },
    };
  }
}
