import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { LogoutButton } from "@/components/auth/logout-button";

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const token = await auth.api.getToken({
    headers: await headers(),
  });

  console.log(token);

  return (
    <div className="flex flex-col gap-4 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          Bem-vindo, {session?.user?.name}!
        </h1>
      </div>

      <div className="flex gap-4">
        {/* Card de Dados do Usuário */}
        <div className="max-w-max space-y-2 rounded-lg bg-gradient-to-br from-blue-500 from-10% to-green-500/80 p-6 text-white">
          <h2 className="mb-4 text-xl">Dados do Usuário:</h2>
          <ul className="space-y-2">
            <li>
              <strong>Nome:</strong> {session?.user?.name}
            </li>
            <li>
              <strong>Email:</strong> {session?.user?.email}
            </li>
            <li>
              <strong>Função:</strong> {session?.user.role}
            </li>
            <li>
              <strong>Verificado:</strong>{" "}
              {session?.user?.emailVerified ? "Sim" : "Não"}
            </li>
          </ul>

          <div className="mt-4">
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  );
}
