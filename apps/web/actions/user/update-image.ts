"use server";

import { auth } from "@/lib/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

const updateImageSchema = z.object({
  imageUrl: z.string().url("URL da imagem inválida"),
});

export async function updateUserImage(formData: FormData) {
  try {
    const imageUrl = formData.get("imageUrl") as string;
    const result = updateImageSchema.safeParse({ imageUrl });

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

    // Atualizar a imagem do usuário usando a API do Better Auth
    await auth.api.updateUser({
      body: {
        image: result.data.imageUrl,
      },
      headers: await headers(),
    });

    // Revalidar caminhos relevantes
    revalidatePath("/settings");

    return {
      success: true,
      message: "Imagem atualizada com sucesso",
    };
  } catch (error) {
    console.error("Erro ao atualizar imagem:", error);
    return {
      success: false,
      error: { server: ["Erro ao atualizar imagem do usuário"] },
    };
  }
}
