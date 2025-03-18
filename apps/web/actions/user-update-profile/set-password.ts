"use server";

import { getUserAuthProviders } from "@/helpers/user-auth-provider";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";

/**
 * Define uma senha para usuários que se autenticaram apenas com provedores OAuth (como Google).
 *
 * @description
 * Esta action é especificamente para usuários que inicialmente se conectaram usando
 * um provedor OAuth (como Google) e desejam definir uma senha para também poderem
 * fazer login com email/senha.
 *
 * Quando um usuário se conecta via OAuth, ele não tem uma senha definida e não possui
 * uma conta do tipo "credential". Esta função cria uma conta adicional do tipo "credential"
 * para o mesmo usuário, permitindo os dois métodos de autenticação.
 *
 * Após a execução bem-sucedida, o usuário terá dois provedores associados à sua conta:
 * - O provedor original (ex: "google")
 * - Um novo provedor "credential" com a senha definida
 *
 * O usuário não deve ver mais este formulário após definir uma senha.
 * Em vez disso, verá o formulário de alteração de senha.
 *
 * @param newPassword - A nova senha que o usuário deseja definir
 * @returns Um objeto indicando o sucesso ou falha da operação
 * @throws Error se o usuário já tiver uma conta com credenciais ou se ocorrer algum erro
 */
export async function setPassword(newPassword: string) {
  const passwordSchema = z
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres");
  passwordSchema.parse(newPassword);

  const { hasCredential } = await getUserAuthProviders();

  if (hasCredential) {
    throw new Error(
      "Usuário já possui credencial. Use a função de alterar senha.",
    );
  }

  try {
    await auth.api.setPassword({
      body: { newPassword },
      headers: await headers(),
    });

    revalidatePath("/settings/user-profile");

    return { success: true, message: "Senha definida com sucesso!" };
  } catch (error) {
    console.error("Erro ao definir senha:", error);
    throw new Error("Falha ao definir senha");
  }
}
