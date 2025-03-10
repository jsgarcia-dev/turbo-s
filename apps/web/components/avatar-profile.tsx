"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SessionResponse } from "@/types/session";
import {
  BoltIcon,
  BookOpenIcon,
  Layers2Icon,
  PinIcon,
  UserPenIcon,
} from "lucide-react";
import Link from "next/link";
import { LogoutButton } from "./auth/logout-button";

interface AvatarProfileProps {
  session: SessionResponse | null;
}

export default function AvatarProfile({ session }: AvatarProfileProps) {
  const userInitials =
    session?.user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "??";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="focus-visible:outline-ring/0 h-auto p-0 hover:bg-transparent focus-visible:border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          <Avatar>
            <AvatarImage
              src={session?.user?.image || "https://github.com/shadcn.png"}
              alt={`Foto de ${session?.user?.name}`}
            />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-45">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="text-foreground flex items-center gap-1 truncate text-sm font-medium">
            {session?.user?.name}
          </span>
          <span className="text-muted-foreground truncate text-xs font-normal">
            {session?.user?.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link
              href="/settings"
              className="group flex cursor-pointer items-center py-2"
            >
              <BoltIcon
                size={16}
                className="mr-1 opacity-60 transition-colors dark:group-hover:text-white dark:group-hover:opacity-100"
                aria-hidden="true"
              />
              <span className="font-medium text-gray-800 dark:text-white">
                Configurações
              </span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href="/option2"
              className="group flex cursor-pointer items-center"
            >
              <Layers2Icon
                size={16}
                className="mr-2 opacity-60 transition-colors dark:group-hover:text-white dark:group-hover:opacity-100"
                aria-hidden="true"
              />
              <span className="font-medium text-gray-800 dark:text-white">
                Option 2
              </span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="group cursor-pointer">
            <BookOpenIcon
              size={16}
              className="mr-2 opacity-60 transition-colors dark:group-hover:text-white dark:group-hover:opacity-100"
              aria-hidden="true"
            />
            <span className="font-medium text-gray-800 dark:text-white">
              Option 3
            </span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="group cursor-pointer">
            <PinIcon
              size={16}
              className="mr-2 opacity-60 transition-colors dark:group-hover:text-white dark:group-hover:opacity-100"
              aria-hidden="true"
            />
            <span className="font-medium text-gray-800 dark:text-white">
              Option 4
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem className="group cursor-pointer">
            <UserPenIcon
              size={16}
              className="mr-2 opacity-60 transition-colors dark:group-hover:text-white dark:group-hover:opacity-100"
              aria-hidden="true"
            />
            <span className="font-medium text-gray-800 dark:text-white">
              Option 5
            </span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="group dark:hover:bg-destructive cursor-pointer">
          <LogoutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
