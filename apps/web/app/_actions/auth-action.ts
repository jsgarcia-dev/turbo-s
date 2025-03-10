// server actions for authentication and account creation
"use server";

import { auth } from "@/lib/auth";
import { z } from "zod";
import { redirect } from "next/navigation";

const passwordSchema = z
  .string()
  .min(8, "Senha deve ter no mínimo 8 caracteres")
  .regex(/[0-9]/, "Senha deve conter pelo menos 1 número")
  .regex(/[a-z]/, "Senha deve conter pelo menos 1 letra minúscula")
  .regex(/[A-Z]/, "Senha deve conter pelo menos 1 letra maiúscula");

const baseAuthSchema = {
  email: z.string().email("Email inválido"),
  password: passwordSchema,
};

const signUpSchema = z.object({
  ...baseAuthSchema,
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
});

const signInSchema = z.object(baseAuthSchema);

export type AuthState = {
  error?: string;
  success?: boolean;
};

export async function authAction(
  _state: AuthState,
  formData: FormData,
  type: "login" | "signup",
): Promise<AuthState> {
  let shouldRedirect: string | null = null;

  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;

    if (type === "login") {
      const result = signInSchema.safeParse({ email, password });

      if (!result.success) {
        return {
          error: result.error.errors[0].message,
        };
      }

      const signInResult = await auth.api.signInEmail({
        body: result.data,
      });

      if (!signInResult) {
        return {
          error: "Credenciais inválidas",
        };
      }

      shouldRedirect = "/";
      return { success: true };
    } else {
      const result = signUpSchema.safeParse({ email, password, name });

      if (!result.success) {
        return {
          error: result.error.errors[0].message,
        };
      }

      const signUpResult = await auth.api.signUpEmail({
        body: result.data,
      });

      if (!signUpResult) {
        return {
          error: "Erro ao criar conta",
        };
      }

      shouldRedirect = "/auth/sign-in";
      return { success: true };
    }
  } catch (error) {
    console.error("Erro na autenticação:", error);
    return {
      error:
        type === "login"
          ? "Ocorreu um erro ao fazer login"
          : "Ocorreu um erro ao criar conta",
    };
  } finally {
    if (shouldRedirect) {
      redirect(shouldRedirect);
    }
  }
}
