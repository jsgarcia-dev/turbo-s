import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { SettingsSidebar } from "./components/settings-sidebar";
import Navbar from "@/components/navbar";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { SessionResponse } from "@/types/session";

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = (await auth.api.getSession({
    headers: await headers(),
  })) as SessionResponse | null;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="mx-auto w-full max-w-7xl">
        {/* Menu de navegação em dispositivos móveis */}
        <div className="sticky top-0 z-40 md:hidden">
          <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 flex items-center gap-3 border-b px-4 py-3 backdrop-blur">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 shrink-0"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu de navegação</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[80%] max-w-[280px] p-6">
                <SheetTitle className="mb-6 text-xl font-semibold">
                  Configurações de perfil
                </SheetTitle>
                <Suspense fallback={<div>Carregando...</div>}>
                  <SettingsSidebar session={session} />
                </Suspense>
              </SheetContent>
            </Sheet>
            <div className="flex flex-col justify-center">
              <h1 className="text-lg font-semibold tracking-tight">
                Configurações de perfil
              </h1>
              <p className="text-muted-foreground text-sm">
                Ajuste suas preferências de acordo com suas necessidades.
              </p>
            </div>
          </div>
        </div>

        {/* Título e descrição da página em desktop */}
        <div className="hidden md:mt-12 md:mb-10 md:block md:px-6">
          <h1 className="text-2xl font-semibold tracking-tight">
            Configurações de perfil
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Gerencie suas informações pessoais e configurações de conta.
          </p>
        </div>

        <div className="flex flex-col gap-6 md:flex-row md:gap-8 md:p-6">
          {/* Menu de navegação em desktop */}
          <aside className="hidden w-full shrink-0 md:block md:w-64 lg:w-72">
            <div className="sticky top-20">
              <Suspense fallback={<div>Carregando...</div>}>
                <SettingsSidebar session={session} />
              </Suspense>
            </div>
          </aside>

          <div className="flex-1">
            <main>
              <div className="overflow-hidden">
                <div className="p-4 md:p-6">{children}</div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
