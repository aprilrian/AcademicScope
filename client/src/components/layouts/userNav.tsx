'use client';

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"
  import { Button } from "@/components/ui/button"
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

  import { useRouter, usePathname } from "next/navigation"
import { Toggle } from "../ui/toggle";
import { ModeToggle } from "../theme/toggle";
  

  export function UserNav() {
    const router = useRouter()
    const { data: session } = useSession();
    const name = session?.user?.nama;
    const image = session?.user?.image;
    const email = session?.user?.email;
    if (!session) {
      // Render loading state or redirect to login
      return (
        <div>
          {/* <Progress value={33} /> */}
          {/* <Loader/> */}
        </div>
      );
    }
    const { user } = session;

    
  return (
    <div className="flex items-center space-x-4">
      <ModeToggle />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage
                alt="User Avatar"
                src={`http://localhost:8080/${user.image}`}
                />
              <AvatarFallback>{name && name.charAt(0)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {/* Additional menu items can be added here if needed */}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={async () => {
              await signOut();
              router.push('/');
            }}
          >
            Log out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}