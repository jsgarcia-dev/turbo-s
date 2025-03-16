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
    <div className="space-y-6">
      <div className="grid gap-6">
        <ProfileImageForm />
        <ProfileNameForm />
        <ProfileEmailForm />
        <ProfilePasswordForm />
      </div>
    </div>
  );
}
