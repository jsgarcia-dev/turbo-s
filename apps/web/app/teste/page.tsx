"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
export default function TestePage() {
  const { data: session } = authClient.useSession();

  console.log(session);

  return (
    <div className="flex flex-col items-center justify-center p-12">
      <h1>Page teste</h1>
      <p>{session?.user?.role}</p>
      <Button
        size="sm"
        className="mt-12 bg-[#006239] text-xs text-white dark:border-green-500/30"
      >
        Click me
      </Button>
    </div>
  );
}
