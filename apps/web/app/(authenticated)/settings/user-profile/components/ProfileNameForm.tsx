"use client";

import { useState, useTransition, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { updateUserName } from "@/actions/user-update-profile/update-name";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Icons } from "@/components/icons";
import { UserIcon, PencilIcon, CheckIcon, XIcon } from "lucide-react";
import { motion } from "framer-motion";

export function ProfileNameForm() {
  const { data: session, isPending: isSessionLoading, refetch } = useSession();
  const [name, setName] = useState(session?.user?.name || "");
  const [isPending, startTransition] = useTransition();
  const [focused, setFocused] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [originalName, setOriginalName] = useState("");

  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
      setOriginalName(session.user.name);
    }
  }, [session?.user?.name]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);

    startTransition(async () => {
      const result = await updateUserName(formData);

      if (result.success) {
        await refetch();
        setIsEditing(false);

        toast.success(result.message, {
          className:
            "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30",
        });
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

        toast.error(errorMessage, {
          className:
            "bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30",
        });
      }
    });
  };

  const cancelEdit = () => {
    setName(originalName);
    setIsEditing(false);
    setFocused(false);
  };

  if (isSessionLoading) {
    return (
      <Card className="from-card/50 to-card w-full overflow-hidden border-0 bg-gradient-to-br shadow-md transition-all">
        <CardHeader className="pb-2">
          <div className="bg-muted h-6 w-3/4 animate-pulse rounded-md"></div>
          <div className="bg-muted h-4 w-full animate-pulse rounded-md"></div>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <div className="space-y-2">
            <div className="bg-muted h-4 w-1/4 animate-pulse rounded-md"></div>
            <div className="bg-muted h-10 w-full animate-pulse rounded-md"></div>
          </div>
          <div className="bg-muted h-10 w-1/3 animate-pulse rounded-md"></div>
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
              <UserIcon className="text-primary h-5 w-5" />
              <CardTitle className="text-xl font-semibold tracking-tight">
                Nome completo
              </CardTitle>
            </div>
            <CardDescription className="text-muted-foreground/80 mt-1">
              Atualize seu nome completo. Seu nome é visível para outros
              usuários do sistema.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="flex-1 space-y-5 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="name"
                  className={`text-sm font-medium transition-colors ${focused ? "text-primary" : "text-foreground/90"}`}
                >
                  {isEditing ? "Editar nome" : "Nome"}
                </Label>
                {!isEditing && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="text-muted-foreground hover:text-foreground h-8 px-2"
                  >
                    <PencilIcon className="mr-1 h-3.5 w-3.5" />
                    <span className="text-xs">Editar</span>
                  </Button>
                )}
              </div>
              <div className="relative">
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  disabled={!isEditing}
                  required
                  minLength={3}
                  className={`border-border/40 bg-background/50 pl-10 transition-all ${
                    !isEditing
                      ? "text-foreground/90 bg-muted/20"
                      : "border-primary/50 shadow-sm"
                  }`}
                />
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <UserIcon
                    className={`h-5 w-5 ${
                      focused && isEditing
                        ? "text-primary"
                        : "text-muted-foreground/60"
                    } transition-colors`}
                  />
                </div>
              </div>
              {isEditing && name && name.length < 3 && (
                <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                  O nome deve ter pelo menos 5 caracteres
                </p>
              )}
            </div>

            {isEditing && (
              <div className="flex gap-2">
                <motion.div whileTap={{ scale: 0.98 }} className="flex-1">
                  <Button
                    type="submit"
                    disabled={isPending || name.length < 3}
                    className="group relative w-full overflow-hidden"
                  >
                    {isPending ? (
                      <div className="flex items-center justify-center gap-2">
                        <Icons.spinner className="h-4 w-4 animate-spin" />
                        <span>Atualizando...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-1">
                        <CheckIcon className="h-4 w-4" />
                        <span>Salvar</span>
                      </div>
                    )}
                    <span className="absolute inset-0 -z-10 animate-[shimmer_3s_infinite] bg-[linear-gradient(90deg,transparent_25%,rgba(59,130,246,0.2)_50%,transparent_95%)] bg-[length:200%_100%] dark:bg-[linear-gradient(90deg,transparent_25%,rgba(16,185,129,0.15)_50%,transparent_75%)]" />
                  </Button>
                </motion.div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={cancelEdit}
                  disabled={isPending}
                  className="border-border/50"
                >
                  <XIcon className="mr-1 h-4 w-4" />
                  <span>Cancelar</span>
                </Button>
              </div>
            )}
          </form>
        </CardContent>

        <CardFooter className="border-border/10 bg-muted/30 text-muted-foreground dark:bg-muted/5 mt-auto border-t p-0">
          <div className="flex h-12 w-full items-center px-6 text-xs">
            Seu nome é visível para outros usuários do sistema
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
