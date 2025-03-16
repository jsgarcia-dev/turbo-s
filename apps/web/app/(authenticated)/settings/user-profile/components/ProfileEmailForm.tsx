"use client";

import { useState, useTransition } from "react";
import { useSession } from "@/lib/auth-client";
import { updateUserEmail } from "@/actions/user-update-profile/update-email";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  InfoIcon,
  MailIcon,
  ArrowRightIcon,
  SparklesIcon,
  AlertTriangle,
} from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

export function ProfileEmailForm() {
  const { data: session, isPending: isSessionLoading } = useSession();
  const [newEmail, setNewEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("newEmail", newEmail);
    formData.append("callbackURL", "/settings/user-profile");

    startTransition(async () => {
      const result = await updateUserEmail(formData);

      if (result.success) {
        toast.success(result.message, {
          icon: <SparklesIcon className="h-4 w-4 text-green-500" />,
          className:
            "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30",
        });
        setNewEmail("");
      } else {
        const errorMessage = result.error
          ? "newEmail" in result.error && result.error.newEmail
            ? result.error.newEmail[0]
            : "auth" in result.error && result.error.auth
              ? result.error.auth[0]
              : "server" in result.error && result.error.server
                ? result.error.server[0]
                : "Não foi possível processar a alteração de email"
          : "Não foi possível processar a alteração de email";

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
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <Skeleton className="h-20 w-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-full" />
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
              <MailIcon className="text-primary h-5 w-5" />
              <CardTitle className="text-xl font-semibold tracking-tight">
                Endereço de email
              </CardTitle>
            </div>
            <CardDescription className="text-muted-foreground/80 mt-1">
              Atualize seu endereço de email. Um email de verificação será
              enviado para confirmar a alteração.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="-mt-10 flex-1 space-y-5 p-6">
          <Alert className="border border-blue-200/30 bg-blue-50/50 text-blue-800 dark:border-blue-900/20 dark:bg-blue-950/20 dark:text-blue-300">
            <InfoIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertTitle className="font-medium text-blue-700 dark:text-blue-300">
              Importante
            </AlertTitle>
            <AlertDescription className="text-blue-600/90 dark:text-blue-400/90">
              Seu email atual é
              <span className="inline-flex items-center rounded-md bg-blue-100/80 px-2 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900/40 dark:text-blue-200">
                {session?.user?.email}
              </span>
              Ao solicitar alteração, você receberá um email de verificação no
              novo endereço.
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="newEmail"
                className={`text-sm font-medium transition-colors ${focused ? "text-primary" : "text-foreground/90"}`}
              >
                Novo email
              </Label>
              <div className="relative">
                <Input
                  id="newEmail"
                  type="email"
                  placeholder="seu-novo-email@exemplo.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  className="border-border/40 bg-background/50 pl-10 transition-all"
                  required
                />
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <MailIcon
                    className={`h-5 w-5 ${focused ? "text-primary" : "text-muted-foreground/60"} transition-colors`}
                  />
                </div>
              </div>
              {newEmail && !newEmail.includes("@") && (
                <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                  Email deve incluir @
                </p>
              )}
            </div>

            <motion.div whileTap={{ scale: 0.98 }} className="mt-2">
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <div className="flex items-center justify-center gap-2">
                    <Icons.spinner className="h-4 w-4 animate-spin" />
                    <span>Enviando...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>Solicitar alteração</span>
                    <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                )}
              </Button>
            </motion.div>
          </form>
        </CardContent>

        <CardFooter className="border-border/10 bg-muted/30 text-muted-foreground dark:bg-muted/5 mt-auto border-t p-0">
          <div className="w-full px-6 py-3 text-xs">
            Seus dados são protegidos de acordo com nossa política de
            privacidade
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
