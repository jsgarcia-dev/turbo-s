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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MyLogo from "@/components/icons/my-logo";
import { Mail, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useActionState } from "react";
import {
  PasswordResetState,
  forgotPasswordAction,
} from "@/app/_actions/auth-reset-password-action";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [state, action, isPending] = useActionState<
    PasswordResetState,
    FormData
  >(forgotPasswordAction, { error: undefined, success: false });
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
    if (state?.success) {
      toast.success(
        state.message || "Email de recuperação enviado com sucesso!",
      );
      setEmail("");
      setEmailError("");
      setIsSubmitted(false);
    }
  }, [state]);

  const validateEmail = (value: string) => {
    if (!value) return "Email é obrigatório*";
    if (!/[^\s@]+@[^\s@]+\.[^\s@]+/.test(value))
      return "Por favor, insira um email válido*";
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (isSubmitted) {
      setEmailError(validateEmail(e.target.value));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitted(true);
    const error = validateEmail(email);
    setEmailError(error);

    if (error) {
      e.preventDefault();
      return;
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="w-[450px]">
        <CardHeader className="mb-6 flex flex-col items-center justify-center">
          <MyLogo className="h-10 w-10" />
          <CardTitle className="text-2xl">Recuperação de Senha</CardTitle>
          <CardDescription>
            Digite seu email para receber um link de recuperação de senha
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action={action}
            className="group"
            noValidate
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail
                    className={cn(
                      "absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500",
                      isSubmitted && emailError && "text-red-500",
                    )}
                  />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    className={cn(
                      "pl-9",
                      isSubmitted && emailError && "border-red-500",
                    )}
                    value={email}
                    onChange={handleChange}
                    aria-describedby="email-error"
                  />
                </div>
                {isSubmitted && emailError && (
                  <p id="email-error" className="text-sm text-red-500">
                    {emailError}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Enviando...
                  </div>
                ) : (
                  "Enviar link de recuperação"
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
