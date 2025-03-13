"use client";

import { useState, useTransition } from "react";
import { useSession } from "@/lib/auth-client";
import { updateUserName } from "@/actions/user";
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

export function ProfileNameForm() {
  const { data: session } = useSession();
  const [name, setName] = useState(session?.user?.name || "");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);

    startTransition(async () => {
      const result = await updateUserName(formData);

      if (result.success) {
        toast.success(result.message);
      } else {
        const errorMessage = result.error
          ? "name" in result.error && result.error.name
            ? result.error.name[0]
            : "auth" in result.error && result.error.auth
              ? result.error.auth[0]
              : "server" in result.error && result.error.server
                ? result.error.server[0]
                : "Não foi possível atualizar o nome"
          : "Não foi possível atualizar o nome";

        toast.error(errorMessage);
      }
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Seu nome</CardTitle>
        <CardDescription>
          Este é o nome que aparecerá para outros usuários do sistema.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome completo</Label>
            <Input
              id="name"
              type="text"
              placeholder="Seu nome completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={3}
            />
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Atualizando...
              </>
            ) : (
              "Atualizar nome"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
