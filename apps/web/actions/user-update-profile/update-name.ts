"use server";

import { auth } from "@/lib/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

const updateNameSchema = z.object({
  name: z.string().min(5, "O nome deve ter pelo menos 5 caracteres"),
});

export async function updateUserName(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const result = updateNameSchema.safeParse({ name });

    if (!result.success) {
      return {
        success: false,
        error: result.error.flatten().fieldErrors,
      };
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return {
        success: false,
        error: { auth: ["Usuário não autenticado"] },
      };
    }

    await auth.api.updateUser({
      body: {
        name: result.data.name,
      },
      headers: await headers(),
    });

    revalidatePath("/settings/user-profile");

    return {
      success: true,
      message: "Nome atualizado com sucesso",
    };
  } catch (error) {
    console.error("Erro ao atualizar nome:", error);
    return {
      success: false,
      error: { server: ["Erro ao atualizar nome do usuário"] },
    };
  }
}
