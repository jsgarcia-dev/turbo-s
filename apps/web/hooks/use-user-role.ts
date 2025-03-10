import { authClient } from "@/lib/auth-client";
import { UserRole } from "@repo/database";

interface UserWithRole {
  role?: UserRole;
  [key: string]: unknown;
}

export async function useUserRole() {
  const { data } = authClient.useSession();
  const user = data?.user;
  const userRole = (user as UserWithRole)?.role as UserRole;

  const hasRole = (role: UserRole) => {
    if (!userRole) return false;
    return userRole === role;
  };

  return { userRole, hasRole };
}
