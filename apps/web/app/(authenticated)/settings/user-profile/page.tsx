import { Metadata } from "next";
import { ProfileImageForm } from "./components/ProfileImageForm";
import { ProfileNameForm } from "./components/ProfileNameForm";
import { ProfileEmailForm } from "./components/ProfileEmailForm";
import { ProfilePasswordForm } from "./components/ProfilePasswordForm";

export const metadata: Metadata = {
  title: "Configurações do Perfil",
  description: "Gerencie suas configurações de perfil de usuário",
};

export default function UserProfilePage() {
  return (
    <div className="container max-w-4xl space-y-8 py-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Configurações do Perfil
        </h1>
        <p className="text-muted-foreground mt-2">
          Gerencie suas informações pessoais e configurações de conta.
        </p>
      </div>

      <div className="grid gap-6">
        <ProfileImageForm />
        <ProfileNameForm />
        <ProfileEmailForm />
        <ProfilePasswordForm />
      </div>
    </div>
  );
}
