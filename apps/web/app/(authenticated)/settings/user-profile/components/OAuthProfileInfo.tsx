"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserIcon, MailIcon, ExternalLinkIcon, InfoIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface OAuthProfileInfoProps {
  name?: string;
  email?: string;
  providers: string[];
}

export function OAuthProfileInfo({
  name,
  email,
  providers = [],
}: OAuthProfileInfoProps) {
  const formatProviderName = (provider: string) => {
    return provider.charAt(0).toUpperCase() + provider.slice(1);
  };

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
                Informações da conta
              </CardTitle>
            </div>
            <CardDescription className="text-muted-foreground/80 mt-1">
              Suas informações de perfil são gerenciadas pelo provedor de
              autenticação.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="flex-1 space-y-5 p-6">
          <Alert variant="default" className="mb-4">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              Como você está conectado via provedor de autenticação externo, o
              nome e email são gerenciados pelo provedor.
            </AlertDescription>
          </Alert>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Nome do usuário */}
            <div className="bg-background/40 space-y-2 rounded-lg border p-4 shadow-sm">
              <div className="flex items-center gap-2">
                <UserIcon className="text-primary h-4 w-4" />
                <span className="text-sm font-medium">Nome</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-medium">
                  {name || "Não disponível"}
                </span>
              </div>
            </div>

            {/* Email do usuário */}
            <div className="bg-background/40 space-y-2 rounded-lg border p-4 shadow-sm">
              <div className="flex items-center gap-2">
                <MailIcon className="text-primary h-4 w-4" />
                <span className="text-sm font-medium">Email</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-medium">
                  {email || "Não disponível"}
                </span>
              </div>
            </div>
          </div>

          {/* Provedores */}
          <div className="mt-4">
            <div className="mb-2 text-sm font-medium">Conectado via:</div>
            <div className="flex flex-wrap gap-2">
              {providers.map((provider) => (
                <Badge
                  key={provider}
                  variant="outline"
                  className="border-primary/30 bg-primary/5 text-primary flex items-center gap-1"
                >
                  {formatProviderName(provider)}
                  <ExternalLinkIcon className="h-3 w-3" />
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>

        <CardFooter className="border-border/10 bg-muted/30 text-muted-foreground dark:bg-muted/5 mt-auto border-t p-0">
          <div className="flex h-12 w-full items-center px-6 text-xs">
            Para alterar essas informações, acesse sua conta no provedor de
            autenticação.
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
