"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MyLogo from "@/components/icons/my-logo";
import { Mail, Loader2, Eye, EyeOff, Lock } from "lucide-react";
import { toast } from "sonner";
import { AuthState, authAction } from "@/actions/auth-action";
import { useActionState } from "react";
import { PasswordInput } from "@/components/ui/password-input";
import { signIn } from "@/lib/auth-client";
import GoogleIcon from "../icons/google-icon";

interface AuthFormProps extends React.ComponentPropsWithoutRef<"div"> {
  type: "login" | "signup";
}

export function AuthForm({ className, type, ...props }: AuthFormProps) {
  const [state, action, isPending] = useActionState<AuthState, FormData>(
    (prevState: AuthState, formData: FormData) =>
      authAction(prevState, formData, type),
    { error: undefined, success: false },
  );
  const [values, setValues] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({ name: "", email: "", password: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
    if (state?.success) {
      toast.success(
        type === "login"
          ? "Login realizado com sucesso!"
          : "Conta criada com sucesso!",
      );

      setValues({ name: "", email: "", password: "" });
      setErrors({ name: "", email: "", password: "" });
      setIsSubmitted(false);
    }
  }, [state, type]);

  const validateField = (name: string, value: string) => {
    let error = "";
    if (name === "name" && type === "signup") {
      if (!value) error = "Nome é obrigatório*";
      else if (value.length < 2) error = "Nome deve ter no mínimo 2 caracteres";
    }
    if (name === "email") {
      if (!value) error = "Email é obrigatório*";
      else if (!/[^\s@]+@[^\s@]+\.[^\s@]+/.test(value))
        error = "Por favor, insira um email válido*";
    }
    if (name === "password") {
      if (!value) error = "Senha é obrigatória*";
      else if (value.length < 6)
        error = "A senha deve ter no mínimo 8 caracteres*";
    }
    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitted(true);

    const emailError = validateField("email", values.email);
    const passwordError = validateField("password", values.password);
    const nameError =
      type === "signup" ? validateField("name", values.name) : "";

    setErrors({ name: nameError, email: emailError, password: passwordError });

    if (emailError || passwordError || (type === "signup" && nameError)) {
      e.preventDefault();
      return;
    }
  };

  const handleGoogleSignIn = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsGoogleLoading(true);
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch {
      setIsGoogleLoading(false);
      toast.error("Erro ao fazer login com Google");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="w-[450px]">
        <CardHeader className="mb-6 flex flex-col items-center justify-center">
          <MyLogo className="h-10 w-10" />
          <CardTitle className="text-2xl">
            {type === "login" ? "Welcome Back" : "Create an account"}
          </CardTitle>
          <CardDescription>
            {type === "login"
              ? "Enter your email below to login to your account"
              : "Enter your email and password below to create your account"}
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
              {type === "signup" && (
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome</Label>
                  <div className="relative">
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Seu nome"
                      className={cn(
                        isSubmitted && errors.name && "border-red-500",
                      )}
                      value={values.name}
                      onChange={handleChange}
                      aria-describedby="name-error"
                    />
                  </div>
                  {isSubmitted && errors.name && (
                    <p id="name-error" className="text-sm text-red-500">
                      {errors.name}
                    </p>
                  )}
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail
                    className={cn(
                      "absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500",
                      isSubmitted && errors.email && "text-red-500",
                    )}
                  />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    className={cn(
                      "pl-9",
                      isSubmitted && errors.email && "border-red-500",
                    )}
                    value={values.email}
                    onChange={handleChange}
                    aria-describedby="email-error"
                  />
                </div>
                {isSubmitted && errors.email && (
                  <p id="email-error" className="text-sm text-red-500">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                {type === "signup" ? (
                  <PasswordInput
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    error={isSubmitted ? errors.password : undefined}
                  />
                ) : (
                  <div className="grid gap-2">
                    <Label htmlFor="password">Senha</Label>
                    <div className="relative">
                      <Lock
                        className={cn(
                          "absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500",
                          isSubmitted && errors.password && "text-red-500",
                        )}
                      />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Digite sua senha"
                        className={cn(
                          "pl-9",
                          isSubmitted && errors.password && "border-red-500",
                        )}
                        value={values.password}
                        onChange={handleChange}
                        aria-describedby="password-error"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute top-1/2 right-2 -translate-y-1/2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-500" />
                        )}
                      </Button>
                    </div>
                    {isSubmitted && errors.password && (
                      <p id="password-error" className="text-sm text-red-500">
                        {errors.password}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {type === "login" && (
                <div className="text-right text-sm">
                  <a
                    href="/auth/forgot-password"
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                  >
                    Esqueci minha senha
                  </a>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {type === "login" ? "Entrando..." : "Criando conta..."}
                  </div>
                ) : type === "login" ? (
                  "Entrar"
                ) : (
                  "Criar conta"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleSignIn}
                disabled={isPending || isGoogleLoading}
              >
                <div className="flex items-center justify-center gap-2">
                  {isGoogleLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <GoogleIcon className="size-6" />
                  )}
                  {isGoogleLoading
                    ? type === "login"
                      ? "Entrando..."
                      : "Cadastrando..."
                    : `${type === "login" ? "Sign In" : "Sign up"} with Google`}
                </div>
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              {type === "login"
                ? "Don't have an account?"
                : "Already have an account?"}{" "}
              <a
                href={type === "login" ? "/auth/sign-up" : "/auth/sign-in"}
                className="underline underline-offset-4"
              >
                {type === "login" ? "Sign up" : "Login"}
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
