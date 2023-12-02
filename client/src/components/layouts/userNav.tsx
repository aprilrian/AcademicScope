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
            src={user.image || "/placeholder-avatar.jpg"}
          />
                  <AvatarFallback>SC</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
    
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Christian Joshua</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    christianjoshua@students.undip.ac.id
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {/* Additional menu items can be added here if needed */}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  signOut();
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