import { type PropsWithChildren } from "react";
import { SettingsSidebar } from "./components/settings-sidebar";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { SessionResponse } from "@/types/session";
import Navbar from "@/components/navbar";

export default async function SettingsLayout({ children }: PropsWithChildren) {
  const session = (await auth.api.getSession({
    headers: await headers(),
  })) as SessionResponse | null;

  return (
    <>
      <Navbar />
      <div className="mx-auto mt-6 w-full max-w-[1400px] p-6">
        <div className="mb-8 space-y-4">
          <Breadcrumbs />

          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Configurações
            </h1>
            <p className="text-muted-foreground text-sm">
              Gerencie suas preferências e configurações da conta.
            </p>
          </div>
        </div>

        <div className="flex gap-16">
          <aside className="w-64 shrink-0 rounded-lg bg-transparent">
            <div className="p-2">
              <SettingsSidebar session={session} />
            </div>
          </aside>

          <div
            className="bg-background flex-1 rounded-lg border p-6"
            role="region"
            aria-label="Conteúdo das configurações"
          >
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
