"use client";

import { useState, useTransition } from "react";
import { useSession } from "@/lib/auth-client";
import { updateUserPassword } from "@/actions/user-update-profile/update-password";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
import { Checkbox } from "@/components/ui/checkbox";
import { PasswordInput } from "@/components/ui/password-input";
import { ShieldCheckIcon, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function ProfilePasswordForm() {
  const { isPending: isSessionLoading } = useSession();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [revokeOtherSessions, setRevokeOtherSessions] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setPasswordMismatch(true);
      toast.error("As senhas não coincidem", {
        icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
        className:
          "bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30",
      });
      return;
    } else {
      setPasswordMismatch(false);
    }

    const formData = new FormData();
    formData.append("currentPassword", currentPassword);
    formData.append("newPassword", newPassword);
    formData.append("confirmPassword", confirmPassword);
    formData.append("revokeOtherSessions", revokeOtherSessions.toString());

    startTransition(async () => {
      const result = await updateUserPassword(formData);

      if (result.success) {
        toast.success(result.message, {
          icon: <ShieldCheckIcon className="h-4 w-4 text-green-500" />,
          className:
            "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30",
        });
        // Limpar os campos após sucesso
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setRevokeOtherSessions(false);
      } else {
        const errorMessage = result.error
          ? "currentPassword" in result.error && result.error.currentPassword
            ? result.error.currentPassword[0]
            : "newPassword" in result.error && result.error.newPassword
              ? result.error.newPassword[0]
              : "confirmPassword" in result.error &&
                  result.error.confirmPassword
                ? result.error.confirmPassword[0]
                : "auth" in result.error && result.error.auth
                  ? result.error.auth[0]
                  : "server" in result.error && result.error.server
                    ? result.error.server[0]
                    : "Não foi possível atualizar a senha"
          : "Não foi possível atualizar a senha";

        toast.error(errorMessage, {
          icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
          className:
            "bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30",
        });
      }
    });
  };

  if (isSessionLoading) {
    return (
      <Card className="from-card/50 to-card w-full overflow-hidden border-0 bg-gradient-to-br shadow-md transition-all">
        <CardHeader className="pb-2">
          <div className="bg-muted h-6 w-3/4 animate-pulse rounded-md"></div>
          <div className="bg-muted h-4 w-full animate-pulse rounded-md"></div>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="bg-muted h-4 w-1/4 animate-pulse rounded-md"></div>
                <div className="bg-muted h-10 w-full animate-pulse rounded-md"></div>
              </div>
            ))}
            <div className="bg-muted h-5 w-40 animate-pulse rounded-md"></div>
            <div className="bg-muted h-10 w-1/3 animate-pulse rounded-md"></div>
          </div>
        </CardContent>
      </Card>
    );
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
                Alterar senha
              </CardTitle>
            </div>
            <CardDescription className="text-muted-foreground/80 mt-1">
              Atualize sua senha para manter sua conta segura.
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

          <form onSubmit={handleSubmit} className="space-y-5">
            <PasswordInput
              label="Senha atual"
              showStrengthIndicator={false}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              minLength={8}
            />

            <PasswordInput
              label="Nova senha"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
            />

            <PasswordInput
              label="Confirmar nova senha"
              showStrengthIndicator={false}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setPasswordMismatch(
                  Boolean(e.target.value && e.target.value !== newPassword),
                );
              }}
              error={passwordMismatch ? "As senhas não coincidem" : undefined}
              required
              minLength={8}
            />

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="revokeOtherSessions"
                checked={revokeOtherSessions}
                onCheckedChange={(checked) =>
                  setRevokeOtherSessions(checked as boolean)
                }
                className="border-border/60 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
              />
              <Label
                htmlFor="revokeOtherSessions"
                className="cursor-pointer text-sm font-normal"
              >
                Encerrar outras sessões ativas
              </Label>
            </div>

            <motion.div whileTap={{ scale: 0.98 }} className="pt-2">
              <Button type="submit" disabled={isPending} className="">
                {isPending ? (
                  <div className="flex items-center justify-center gap-2">
                    <Icons.spinner className="h-4 w-4 animate-spin" />
                    <span>Atualizando...</span>
                  </div>
                ) : (
                  <span>Atualizar senha</span>
                )}
              </Button>
            </motion.div>
          </form>
        </CardContent>

        <CardFooter className="border-border/10 bg-muted/30 text-muted-foreground dark:bg-muted/5 mt-auto border-t p-0">
          <div className="w-full px-6 py-3 text-xs">
            Uma senha forte ajuda a proteger sua conta contra acesso não
            autorizado
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
