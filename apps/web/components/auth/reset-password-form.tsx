"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import MyLogo from "@/components/icons/my-logo";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useActionState } from "react";
import {
  PasswordResetState,
  resetPasswordAction,
} from "@/app/_actions/auth-reset-password-action";
import { PasswordInput } from "@/components/ui/password-input";
import { useSearchParams, useRouter } from "next/navigation";

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [state, action, isPending] = useActionState<
    PasswordResetState,
    FormData
  >(resetPasswordAction, { error: undefined, success: false });
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error("Token de recuperação não encontrado");
      router.push("/auth/forgot-password");
    }
  }, [token, router]);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
    if (state?.success) {
      toast.success(state.message || "Senha redefinida com sucesso!");
      setPassword("");
      setPasswordError("");
      setIsSubmitted(false);

      // Redirecionar para a página de login após alguns segundos
      setTimeout(() => {
        router.push("/auth/sign-in");
      }, 2000);
    }
  }, [state, router]);

  const validatePassword = (value: string) => {
    if (!value) return "Senha é obrigatória*";
    if (value.length < 8) return "A senha deve ter no mínimo 8 caracteres*";
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (isSubmitted) {
      setPasswordError(validatePassword(e.target.value));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitted(true);
    const error = validatePassword(password);
    setPasswordError(error);

    if (error) {
      e.preventDefault();
      return;
    }
  };

  if (!token) {
    return null;
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="w-[450px]">
        <CardHeader className="mb-6 flex flex-col items-center justify-center">
          <MyLogo className="h-10 w-10" />
          <CardTitle className="text-2xl">Redefinir Senha</CardTitle>
          <CardDescription>
            Digite sua nova senha para continuar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action={action}
            className="group"
            noValidate
            onSubmit={handleSubmit}
          >
            <input type="hidden" name="token" value={token} />

            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="password">Nova Senha</Label>
                <PasswordInput
                  id="password"
                  name="password"
                  placeholder="Digite sua nova senha"
                  value={password}
                  onChange={handleChange}
                  error={isSubmitted ? passwordError : undefined}
                  showStrengthIndicator={true}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Redefinindo...
                  </div>
                ) : (
                  "Redefinir Senha"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" asChild>
            <a href="/auth/sign-in" className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Voltar para o login
            </a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
