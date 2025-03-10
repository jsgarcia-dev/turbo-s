"use client";

import { Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";

// Dicionário global de traduções
const globalPathTranslations: Record<string, string> = {
  settings: "Configurações",
  permissions: "Permissões",
  plans: "Planos",
  notifications: "Notificações",
  appearance: "Tema",
  language: "Idioma",
  dashboard: "Dashboard",
  projects: "Projetos",
  users: "Usuários",
  // ... outras traduções globais
};

interface BreadcrumbsProps {
  homeIcon?: React.ReactNode;
  homeLabel?: string;
  translations?: Record<string, string>;
  rootPath?: string;
}

export function Breadcrumbs({
  homeIcon = <Home className="h-4 w-4" />,
  homeLabel = "Início",
  translations = {},
  rootPath,
}: BreadcrumbsProps) {
  const pathname = usePathname();

  // Remove o rootPath se especificado
  const processedPath = rootPath ? pathname.replace(rootPath, "") : pathname;
  const paths = processedPath.split("/").filter(Boolean);

  // Combina traduções globais com as específicas da página
  const pathTranslations = { ...globalPathTranslations, ...translations };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/" className="flex items-center">
              {homeIcon}
              <span className="sr-only">{homeLabel}</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {paths.map((path, index) => {
          const href = `/${paths.slice(0, index + 1).join("/")}`;
          const label =
            pathTranslations[path] ||
            path.charAt(0).toUpperCase() + path.slice(1);
          const isLast = index === paths.length - 1;

          return (
            <React.Fragment key={href}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
