import { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BellIcon,
  ShieldIcon,
  PlugIcon,
  UserIcon,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Configurações de perfil",
  description: "Gerenciar suas informações pessoais e configurações de conta",
};

export default async function SettingsPage() {
  const settingsCards = [
    {
      title: "Perfil do Usuário",
      description:
        "Atualize seus dados pessoais, foto de perfil, email e senha",
      href: "/settings/user-profile",
      icon: UserIcon,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/30",
    },
    {
      title: "Notificações",
      description: "Configure suas preferências de notificações e alertas",
      href: "/settings/notifications",
      icon: BellIcon,
      color: "text-amber-500",
      bgColor: "bg-amber-50 dark:bg-amber-900/30",
    },
    {
      title: "Segurança",
      description:
        "Proteja sua conta com verificação em duas etapas e histórico de acessos",
      href: "/settings/security",
      icon: ShieldIcon,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/30",
    },
    {
      title: "Integrações",
      description: "Conecte sua conta com outros serviços e aplicativos",
      href: "/settings/integrations",
      icon: PlugIcon,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/30",
    },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
        {settingsCards.map((card) => (
          <Link href={card.href} key={card.href} className="group block">
            <Card
              className={cn(
                "flex h-full flex-col border transition-all",
                "hover:shadow-foreground/5 hover:border-foreground/10 hover:shadow-lg",
              )}
            >
              <CardHeader className="flex px-6 py-6">
                <div
                  className={cn(
                    "flex size-11 shrink-0 items-center justify-center rounded-full",
                    card.bgColor,
                  )}
                >
                  <card.icon className={cn("size-6", card.color)} />
                </div>
                <div className="ml-4 flex flex-col justify-center">
                  <CardTitle className="text-lg font-semibold">
                    {card.title}
                  </CardTitle>
                  <CardDescription className="text-foreground/70 mt-1 text-sm leading-relaxed">
                    {card.description}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="mt-auto flex justify-end px-6 pt-0 pb-6">
                <span
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "gap-1.5 font-medium",
                    "hover:border-foreground/10 group-hover:border-foreground/10 border-transparent",
                    "bg-transparent",
                  )}
                >
                  Configurar
                  <ChevronRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
