"use client";

import { FC, useEffect, useState } from "react";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import EditProfile from "./updProfil";
import { Loader } from "lucide-react";
import axios from "axios";

interface UserProfileProps {}

const UserProfile: FC<UserProfileProps> = () => {
  const { data: session } = useSession();
  const role = session?.user?.role;
  const accessToken = session?.user?.access_token;

  const [userData, setUserData] = useState({
    nim: "",
    nama: "",
    angkatan: "",
    alamat: "",
    kabupatenKota: 0,
    provinsi: 0,
    jalur_masuk: "",
    email: "",
    phone: "",
    foto: "",
    nama_dosen: "",
  });

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get("http://localhost:8080/profileDetail", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          // "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        const userProfile = response.data;
        setUserData(userProfile);
      } else {
        // Handle error
        console.error("Failed to fetch user profile");
      }
    } catch (error) {
      // Handle error
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    if (session) {
      fetchUserProfile();
    }
  }, [session]);

  if (!session) {
    // Render loading state or redirect to login
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center  bg-gray-100 dark:bg-gray-800">
      <Card className="w-11/12 p-6 rounded-lg shadow-xl">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-64 w-64">
            <AvatarImage
              alt="User Avatar"
              src={`http://localhost:8080/${userData.foto}`}
              className="h-full w-full rounded-full object-cover"
            />
            <AvatarFallback>
              {userData.nama && userData.nama.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h2 className="text-2xl font-bold">
              {userData.nama || "Not Set"}
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {role
                ? role.charAt(0).toUpperCase() + role.slice(1)
                : "Full Stack Developer at Acme Inc."}
            </p>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 space-y-2">
          <div className="flex justify-between">
            <span className="font-medium text-sm">Email:</span>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              {userData.email || "Not Set"}
            </span>
          </div>
          {/* Add more fields based on your JSON structure */}
          {/* Example: */}
          <div className="flex justify-between">
            <span className="font-medium text-sm">Nama Lengkap:</span>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              {userData.nama || "Not Set"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-sm">NIM:</span>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              {userData.nim || "Not Set"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-sm">Angkatan:</span>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              {userData.angkatan || "Not Set"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-sm">Alamat:</span>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              {userData.alamat || "Not Set"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-sm">Kabupaten:</span>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              {userData.kabupatenKota || "Not Set"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-sm">Provinsi:</span>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              {userData.provinsi || "Not Set"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-sm">Jalur Masuk:</span>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              {userData.jalur_masuk || "Not Set"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-sm">No. Telpon:</span>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              {userData.phone || "Not Set"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-sm">Dosen Wali:</span>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              {userData.nama_dosen || "Not Set"}
            </span>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <EditProfile />
        </div>
      </Card>
    </div>
  );
};

export default UserProfile;
