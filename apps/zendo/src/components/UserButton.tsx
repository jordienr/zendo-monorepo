import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Link from "next/link";
import { useUser } from "@/utils/supabase/browser";
import { useIsSubscribed, useSubscriptionQuery } from "@/queries/subscription";
import { cn } from "@/lib/utils";

type Props = {};

const UserButton = (props: Props) => {
  const user = useUser();
  const isSubbed = useIsSubscribed();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 rounded-full">
          <div
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 font-bold text-white"
            )}
          >
            {user?.email?.slice(0, 1).toUpperCase()}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="hover:bg-transparent">
            <div className="flex flex-col">
              <span className="text-xs text-zinc-400">Signed in as</span>
              <span className="font-medium">{user?.email}</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/account">Account settings</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/sign-out">Sign out</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default UserButton;
