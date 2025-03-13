"use client";

import { useState, useTransition } from "react";
import { useSession } from "@/lib/auth-client";
import { updateUserImage } from "@/actions/user";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Icons } from "@/components/icons";

export function ProfileImageForm() {
  const { data: session } = useSession();
  const [imageUrl, setImageUrl] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("imageUrl", imageUrl);

    startTransition(async () => {
      const result = await updateUserImage(formData);

      if (result.success) {
        toast.success(result.message);
        setImageUrl("");
      } else {
        const errorMessage = result.error
          ? "imageUrl" in result.error && result.error.imageUrl
            ? result.error.imageUrl[0]
            : "auth" in result.error && result.error.auth
              ? result.error.auth[0]
              : "server" in result.error && result.error.server
                ? result.error.server[0]
                : "Não foi possível atualizar a imagem"
          : "Não foi possível atualizar a imagem";

        toast.error(errorMessage);
      }
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Foto de Perfil</CardTitle>
        <CardDescription>
          Atualize sua foto de perfil. Uma imagem clara ajuda outros membros a
          reconhecê-lo.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-5">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src={session?.user?.image || undefined}
              alt={session?.user?.name || "Avatar"}
            />
            <AvatarFallback className="text-lg">
              {session?.user?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="imageUrl">URL da imagem</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  placeholder="https://exemplo.com/minha-imagem.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Atualizando...
                  </>
                ) : (
                  "Atualizar imagem"
                )}
              </Button>
            </form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
