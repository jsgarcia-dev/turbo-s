import Link from "next/link";
import AvatarProfile from "./avatar-profile";
import MyLogo from "@/components/icons/my-logo";
import ModeToggle from "./mode-toggle";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { SessionResponse } from "@/types/session";
import { Button } from "./ui/button";

export default async function Navbar() {
  const session = (await auth.api.getSession({
    headers: await headers(),
  })) as SessionResponse | null;

  const isAuthenticated = !!session?.user;

  return (
    <header className="z-50 h-16 w-full border-b backdrop-blur-sm">
      <div className="@container mx-auto flex h-full max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <MyLogo className="size-7" />
          <span className="font-mono text-lg font-bold">TURBO-DEV</span>
        </Link>
        <nav className="flex h-full items-center">
          <div className="flex items-center gap-5">
            <div className="flex items-center">
              <ModeToggle />
            </div>
            <div className="bg-border h-6 w-[1px]" />
            <div className="flex items-center">
              {isAuthenticated ? (
                <AvatarProfile session={session} />
              ) : (
                <Button asChild>
                  <Link href="/auth/sign-in">Entrar</Link>
                </Button>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
