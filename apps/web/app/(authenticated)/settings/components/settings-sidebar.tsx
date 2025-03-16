"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Settings, Bell, Plug, Shield, User, Users } from "lucide-react";
import { SessionResponse } from "@/types/session";

const baseNavigationItems = [
  {
    title: "Visão Geral",
    href: "/settings",
    icon: Settings,
    description: "Configurações gerais da conta",
  },
  {
    title: "Perfil do Usuário",
    href: "/settings/user-profile",
    icon: User,
    description: "Atualize seus dados pessoais",
  },
  {
    title: "Notificações",
    href: "/settings/notifications",
    icon: Bell,
    description: "Configure suas preferências de notificações",
  },
  {
    title: "Segurança",
    href: "/settings/security",
    icon: Shield,
    description: "Proteja sua conta com verificação em duas etapas",
  },
  {
    title: "Integrações",
    href: "/settings/integrations",
    icon: Plug,
    description: "Conecte sua conta com outros serviços",
  },
] as const;

const adminNavigationItems = [
  {
    title: "Permissões",
    href: "/settings/permissions",
    icon: Users,
    description: "Gerenciar permissões dos usuários",
    adminOnly: true,
  },
] as const;

interface SettingsSidebarProps {
  session: SessionResponse | null;
}

export function SettingsSidebar({ session }: SettingsSidebarProps) {
  const pathname = usePathname();
  const isAdmin = session?.user?.role === "ADMIN";

  const navigationItems = [
    ...baseNavigationItems,
    ...(isAdmin ? adminNavigationItems : []),
  ];

  return (
    <div className="pb-2">
      <nav
        className="max-h-[calc(100vh-6rem)] space-y-1 overflow-auto md:max-h-[calc(100vh-8rem)]"
        aria-label="Menu de configurações"
      >
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex h-10 w-full items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary dark:bg-primary/15"
                  : "text-muted-foreground hover:bg-muted focus-visible:bg-muted",
              )}
              aria-current={isActive ? "page" : undefined}
              title={item.description}
            >
              <Icon
                className={cn(
                  "h-4 w-4",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
                aria-hidden="true"
              />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
