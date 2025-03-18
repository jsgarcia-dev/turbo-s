import { Metadata } from "next";
import { ProfileImageForm } from "./components/ProfileImageForm";
import { ProfileNameForm } from "./components/ProfileNameForm";
import { ProfileEmailForm } from "./components/ProfileEmailForm";
import { ProfilePasswordForm } from "./components/ProfilePasswordForm";
import { SetPasswordForm } from "./components/ProfileSetPasswordForm";
import { getUserAuthProviders } from "@/helpers/user-auth-provider";
import { OAuthProfileInfo } from "./components/OAuthProfileInfo";

export const metadata: Metadata = {
  title: "Configurações do Perfil",
  description: "Gerencie suas configurações de perfil de usuário",
};

export default async function UserProfilePage() {
  const userAuth = await getUserAuthProviders();

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        <ProfileImageForm />

        {userAuth.hasOAuth ? (
          <OAuthProfileInfo
            name={userAuth.user?.name}
            email={userAuth.user?.email}
            providers={userAuth.oauthProviders}
          />
        ) : (
          <>
            <ProfileNameForm />
            <ProfileEmailForm />
          </>
        )}

        {userAuth.hasCredential ? (
          <ProfilePasswordForm />
        ) : (
          <SetPasswordForm hasCredential={false} />
        )}
      </div>
    </div>
  );
}
