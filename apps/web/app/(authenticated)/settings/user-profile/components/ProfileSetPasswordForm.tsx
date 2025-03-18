"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { setPassword } from "@/actions/user-update-profile";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Icons } from "@/components/icons";
import { PasswordInput } from "@/components/ui/password-input";
import { ShieldCheckIcon, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";

const SetPasswordSchema = z
  .object({
    newPassword: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type SetPasswordFormValues = z.infer<typeof SetPasswordSchema>;

interface SetPasswordFormProps {
  hasCredential: boolean;
}

export function SetPasswordForm({ hasCredential }: SetPasswordFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<SetPasswordFormValues>({
    resolver: zodResolver(SetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword");
  const confirmPassword = watch("confirmPassword");

  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("newPassword", e.target.value);
    if (confirmPassword) {
      setPasswordMismatch(e.target.value !== confirmPassword);
    }
  };

  const onConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("confirmPassword", e.target.value);
    if (e.target.value) {
      setPasswordMismatch(e.target.value !== newPassword);
    } else {
      setPasswordMismatch(false);
    }
  };

  async function onSubmit(data: SetPasswordFormValues) {
    if (data.newPassword !== data.confirmPassword) {
      setPasswordMismatch(true);
      toast.error("As senhas não coincidem", {
        icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
        className:
          "bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await setPassword(data.newPassword);

      if (result.success) {
        toast.success(result.message, {
          icon: <ShieldCheckIcon className="h-4 w-4 text-green-500" />,
          className:
            "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30",
        });
        reset();
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erro ao definir nova senha. Tente novamente.";

      toast.error(errorMessage, {
        icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
        className:
          "bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (hasCredential) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-border/30 from-card/50 to-card dark:border-border/10 dark:to-card/95 flex w-full flex-col overflow-hidden border bg-gradient-to-br p-0 shadow-md transition-all hover:shadow-lg dark:bg-gradient-to-br dark:from-gray-950/80">
        <CardHeader className="border-border/10 bg-muted/30 dark:bg-muted/5 gap-y-1 border-b p-0">
          <div className="px-6 py-4">
            <div className="flex items-center gap-2">
              <ShieldCheckIcon className="text-primary h-5 w-5" />
              <CardTitle className="text-xl font-semibold tracking-tight">
                Definir senha
              </CardTitle>
            </div>
            <CardDescription className="text-muted-foreground/80 mt-1">
              Como você se conectou com um provedor externo, defina uma senha
              para também poder acessar sua conta diretamente.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="flex-1 space-y-5 p-6">
          <Alert className="border border-amber-200/30 bg-amber-50/50 text-amber-800 dark:border-amber-900/20 dark:bg-amber-950/20 dark:text-amber-300">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertDescription className="text-amber-600/90 dark:text-amber-400/90">
              Escolha uma senha forte com pelo menos 8 caracteres, incluindo
              números, letras e caracteres especiais.
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <PasswordInput
              label="Nova senha"
              showStrengthIndicator={true}
              {...register("newPassword")}
              value={newPassword}
              onChange={onPasswordChange}
              error={errors.newPassword?.message}
              required
              minLength={8}
            />

            <PasswordInput
              label="Confirmar nova senha"
              showStrengthIndicator={false}
              {...register("confirmPassword")}
              value={confirmPassword}
              onChange={onConfirmPasswordChange}
              error={
                passwordMismatch
                  ? "As senhas não coincidem"
                  : errors.confirmPassword?.message
              }
              required
              minLength={8}
            />

            <motion.div whileTap={{ scale: 0.98 }} className="pt-2">
              <Button type="submit" disabled={isSubmitting} className="">
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <Icons.spinner className="h-4 w-4 animate-spin" />
                    <span>Processando...</span>
                  </div>
                ) : (
                  <span>Definir senha</span>
                )}
              </Button>
            </motion.div>
          </form>
        </CardContent>

        <CardFooter className="border-border/10 bg-muted/30 text-muted-foreground dark:bg-muted/5 mt-auto border-t p-0">
          <div className="w-full px-6 py-3 text-xs">
            Definir uma senha permite que você acesse sua conta diretamente, sem
            depender do provedor externo.
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
