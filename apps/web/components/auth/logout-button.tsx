"use client";

import { useState } from "react";

import { Loader2, LogOutIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
export function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/auth/sign-in");
          },
        },
      });
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleLogout}
      variant="ghost"
      className="group h-6 cursor-pointer py-1 hover:bg-transparent"
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="font-medium text-gray-800 dark:text-white">
            Saindo...
          </span>
        </>
      ) : (
        <>
          <LogOutIcon
            size={16}
            className="opacity-60 transition-colors dark:group-hover:text-white dark:group-hover:opacity-100"
            aria-hidden="true"
          />
          <span className="font-medium text-gray-800 dark:text-white">
            Logout
          </span>
        </>
      )}
    </Button>
  );
}
