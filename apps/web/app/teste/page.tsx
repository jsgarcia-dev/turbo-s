"use client";

import { authClient } from "@/lib/auth-client";

export default function TestePage() {
  const { data: session } = authClient.useSession();

  console.log(session);

  return (
    <div>
      <h1>Page teste</h1>
      <p>{session?.user?.role}</p>
    </div>
  );
}
