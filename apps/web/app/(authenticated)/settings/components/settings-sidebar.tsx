"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Settings, Bell, Plug, Shield, Users } from "lucide-react";
import { SessionResponse } from "@/types/session";

const baseNavigationItems = [
  {
    title: "Dados da conta",
    href: "/settings",
    icon: Settings,
    description: "Configurações gerais da conta",
  },
  {
    title: "Notificações",
    href: "/settings/notifications",
    icon: Bell,
    description: "Gerenciar suas notificações",
  },
  {
    title: "Segurança",
    href: "/settings/security",
    icon: Shield,
    description: "Gerencie a segurança da sua conta",
  },
  {
    title: "Integrações",
    href: "/settings/integrations",
    icon: Plug,
    description: "Conecte outros serviços",
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
    <nav className="space-y-1" aria-label="Menu de configurações">
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
                ? "bg-muted dark:text-white"
                : "hover:bg-muted focus-visible:bg-muted",
            )}
            aria-current={isActive ? "page" : undefined}
            title={item.description}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            <span>{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}
