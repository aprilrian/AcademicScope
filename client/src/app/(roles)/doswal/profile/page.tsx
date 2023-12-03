// UserProfile.tsx
'use client';

import { FC } from 'react';
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";

import { Card } from "@/components/ui/card";
import { useSession } from "next-auth/react";


import EditProfile from "./EditProfile";
import { Loader } from 'lucide-react';

interface UserProfileProps {}

const UserProfile: FC<UserProfileProps> = () => {
  const { data: session } = useSession();

  if (!session) {
    // Render loading state or redirect to login
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800">
        <Loader />
      </div>
    );
  }

  const { user } = session;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800">
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
        </div>
        <div className="flex justify-end mt-4">
          <EditProfile />
        </div>
      </Card>
    </div>
  );
}

export default UserProfile;
