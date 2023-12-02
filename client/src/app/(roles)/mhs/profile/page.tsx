"use client";

import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";

import { Card } from "@/components/ui/card";
import { useSession } from "next-auth/react";

import { Loader } from "lucide-react";
import EditProfile from "./updProfil";

export default function UserProfile() {
  const { data: session } = useSession();

  if (!session) {
    // Render loading state or redirect to login
    return (
      <div>
        {/* <Progress value={33} /> */}
        <Loader/>
      </div>
    );
  }

  const { user } = session;

  // const handleEditProfile = () => {
  //   // Add logic to handle the edit profile action
  //   console.log("Edit Profile clicked!");
  //   // You can redirect to the edit profile page or show a modal for editing.
  // };

  return (
    <Card className="mx-auto max-w-md p-6 rounded-lg shadow-xl bg-white dark:bg-zinc-900">
      <div className="flex flex-col items-center space-y-4">
        <Avatar className="h-24 w-24">
          <AvatarImage
            alt="User Avatar"
            src={user.image || "/placeholder-avatar.jpg"}
          />
          <AvatarFallback>
            {user.username && user.username.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="text-center">
          <h2 className="text-2xl font-bold">{user.nama || "John Doe"}</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {user.role || "Full Stack Developer at Acme Inc."}
          </p>
        </div>
      </div>
      <div className="mt-8 border-t pt-6 space-y-2">
        <div className="flex justify-between">
          <span className="font-medium text-sm">Email:</span>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            {user.email || "john.doe@example.com"}
          </span>
        </div>
        <div className="flex justify-end">
          {/* <Button onClick={handleEditProfile}>Edit Profile</Button> */}
          <EditProfile/>
        </div>
      </div>
    </Card>
  );
}
