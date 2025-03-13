"use client";

import { useState, useTransition } from "react";
import { updateUserPassword } from "@/actions/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Icons } from "@/components/icons";
import { Checkbox } from "@/components/ui/checkbox";

export function ProfilePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [revokeOtherSessions, setRevokeOtherSessions] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    const formData = new FormData();
    formData.append("currentPassword", currentPassword);
    formData.append("newPassword", newPassword);
    formData.append("confirmPassword", confirmPassword);
    formData.append("revokeOtherSessions", revokeOtherSessions.toString());

    startTransition(async () => {
      const result = await updateUserPassword(formData);

      if (result.success) {
        toast.success(result.message);
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

        toast.error(errorMessage);
      }
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Alterar senha</CardTitle>
        <CardDescription>
          Atualize sua senha para manter sua conta segura.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Senha atual</Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">Nova senha</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="revokeOtherSessions"
              checked={revokeOtherSessions}
              onCheckedChange={(checked) =>
                setRevokeOtherSessions(checked as boolean)
              }
            />
            <Label
              htmlFor="revokeOtherSessions"
              className="cursor-pointer text-sm font-normal"
            >
              Encerrar outras sessões ativas
            </Label>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full sm:w-auto"
          >
            {isPending ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Atualizando...
              </>
            ) : (
              "Atualizar senha"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
