"use client";

import { useState, useTransition } from "react";
import { useSession } from "@/lib/auth-client";
import { updateUserImage } from "@/actions/user-update-profile/update-image";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Icons } from "@/components/icons";
import { CameraIcon, ImageIcon } from "lucide-react";
import AvatarUploadModal from "./avatar-upload-modal";
import { motion } from "framer-motion";

export function ProfileImageForm() {
  const { data: session, isPending: isSessionLoading } = useSession();
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageUpdate = (imageUrl: string) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("imageUrl", imageUrl);

      const result = await updateUserImage(formData);

      if (result.success) {
        toast.success(result.message, {
          icon: <ImageIcon className="h-4 w-4 text-green-500" />,
          className:
            "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30",
        });
        setIsModalOpen(false);
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

  if (isSessionLoading) {
    return (
      <Card className="from-card/50 to-card w-full overflow-hidden border-0 bg-gradient-to-br shadow-md transition-all">
        <CardHeader className="pb-2">
          <div className="bg-muted h-6 w-3/4 animate-pulse rounded-md"></div>
          <div className="bg-muted h-4 w-full animate-pulse rounded-md"></div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center gap-5">
            <div className="bg-muted h-24 w-24 animate-pulse rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="bg-muted h-4 w-full animate-pulse rounded-md"></div>
              <div className="bg-muted h-4 w-3/4 animate-pulse rounded-md"></div>
              <div className="bg-muted h-10 w-1/3 animate-pulse rounded-md"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border-border/30 from-card/50 to-card dark:border-border/10 dark:to-card/95 flex w-full flex-col overflow-hidden border bg-gradient-to-br p-0 shadow-md transition-all hover:shadow-lg dark:bg-gradient-to-br dark:from-gray-950/80">
          <CardHeader className="border-border/10 bg-muted/30 dark:bg-muted/5 gap-y-1 border-b p-0">
            <div className="px-6 py-4">
              <div className="flex items-center gap-2">
                <ImageIcon className="text-primary h-5 w-5" />
                <CardTitle className="text-xl font-semibold tracking-tight">
                  Foto de Perfil
                </CardTitle>
              </div>
              <CardDescription className="text-muted-foreground/80 mt-1">
                Atualize sua foto de perfil. Uma imagem clara ajuda outros
                membros a reconhecê-lo.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="flex-1 space-y-5 p-6">
            <div className="flex flex-col items-center gap-5 sm:flex-row">
              <div className="group relative">
                <Avatar className="border-border/50 bg-muted/20 hover:border-primary/20 group-hover:border-primary/50 group-hover:ring-primary/20 h-24 w-24 border-2 shadow-sm transition-all group-hover:ring-2">
                  <AvatarImage
                    src={session?.user?.image || undefined}
                    alt={session?.user?.name || "Avatar"}
                    className="object-cover transition-all group-hover:brightness-[0.9] group-hover:contrast-[1.1]"
                  />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl font-medium">
                    {session?.user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  className="bg-primary hover:bg-primary/90 absolute -right-2 -bottom-2 size-8 rounded-full shadow-md transition-transform duration-200 group-hover:scale-110 hover:shadow-lg"
                  onClick={() => setIsModalOpen(true)}
                >
                  <CameraIcon className="size-4 dark:text-black" />
                  <span className="absolute inset-0 -z-10 animate-[shimmer_3s_infinite] bg-[linear-gradient(90deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_95%)] bg-[length:200%_100%] dark:bg-[linear-gradient(90deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)]" />
                </Button>
                <div className="bg-primary/5 pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity group-hover:opacity-100"></div>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-foreground mb-1 font-medium">
                  {session?.user?.name || "Usuário"}
                </h3>
                <p className="text-muted-foreground mb-3 text-sm">
                  {session?.user?.image
                    ? "Você pode alterar sua foto clicando no botão abaixo."
                    : "Você ainda não tem uma foto de perfil. Adicione uma para personalizar sua conta."}
                </p>
                <Button
                  variant="outline"
                  onClick={() => setIsModalOpen(true)}
                  disabled={isPending}
                  className="relative mt-2 overflow-hidden"
                >
                  {isPending ? (
                    <span className="flex items-center gap-2">
                      <Icons.spinner className="mr-2 size-4 animate-spin" />
                      Processando...
                    </span>
                  ) : session?.user?.image ? (
                    "Alterar imagem"
                  ) : (
                    "Adicionar imagem"
                  )}
                  <span className="absolute inset-0 -z-10 animate-[shimmer_3s_infinite] bg-[linear-gradient(90deg,transparent_25%,rgba(59,130,246,0.3)_50%,transparent_95%)] bg-[length:200%_100%] dark:bg-[linear-gradient(90deg,transparent_25%,rgba(16,185,129,0.15)_50%,transparent_75%)]" />
                </Button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="border-border/10 bg-muted/30 text-muted-foreground dark:bg-muted/5 mt-auto border-t p-0">
            <div className="flex h-12 w-full items-center px-6 text-xs">
              Formatos suportados: JPG, PNG, GIF (máx 5MB)
            </div>
          </CardFooter>
        </Card>
      </motion.div>

      <AvatarUploadModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUploadSuccess={handleImageUpdate}
        currentAvatarUrl={session?.user?.image || undefined}
      />
    </>
  );
}
