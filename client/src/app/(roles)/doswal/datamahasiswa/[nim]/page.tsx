"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";

const dummyUserData = {
  nama: "John Doe",
  nim: "123456789",
  angkatan: "2020",
  dosenWali: "Dr. Jane Smith",
  image: "/john_doe_avatar.jpg",
  username: "john_doe",
  role: "Full Stack Developer at Acme Inc.",
  email: "john.doe@example.com",
};

const dummySemesterData = [
  {
    isSkripsiLulus: true,
    isPklLulus: false,
    isIrsKhsDiisikan: true,
  },
  {
    isSkripsiLulus: false,
    isPklLulus: true,
    isIrsKhsDiisikan: false,
  },
  {
    isSkripsiLulus: true,
    isPklLulus: true,
    isIrsKhsDiisikan: false,
  },
];

interface SemesterData {
  isSkripsiLulus: boolean;
  isPklLulus: boolean;
  isIrsKhsDiisikan: boolean;
}

const MahasiswaCard = () => {
  const [user, setUser] = useState(dummyUserData);
  const [semesterData, setSemesterData] = useState(dummySemesterData);
  const { data: session } = useSession();
  const accessToken = session?.user?.access_token;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/profileDetail",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              // "Content-Type": "multipart/form-data",
            },
          }
        );

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

    const fetchSemesterData = async () => {
      try {
        const response = await axios.get(
          "src/components/data/detailMhs/semesterData.json"
        );
        setSemesterData(response.data);
      } catch (error) {
        console.error("Error fetching semester data:", error);
      }
    };

    fetchUserData();
    fetchSemesterData();
  }, []);

  const getButtonColor = (semester: any) => {
    if (semester.isSkripsiLulus) {
      return "bg-green-500";
    } else if (semester.isPklLulus) {
      return "bg-yellow-500";
    } else if (semester.isIrsKhsDiisikan) {
      return "bg-blue-500";
    } else {
      return "bg-red-500";
    }
  };

  return (
    <>
      <Card className="mx-auto my-1 p-6 rounded-lg shadow-xl bg-white dark:bg-zinc-900">
        <CardHeader>
          <CardTitle>
            Progress Perkembangan Studi Mahasiswa Informatika Fakultas Sains dan
            Matematika UNDIP Semarang
          </CardTitle>
          <CardDescription>Detail Mahasiswa</CardDescription>
        </CardHeader>
        <CardContent>
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
              <h2 className="text-2xl font-bold">{user.nama || "N/A"}</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {user.role || "N/A"}
              </p>
            </div>
          </div>
          <div className="mt-8 border-t pt-6 space-y-2">
            <div className="flex justify-between">
              <span className="font-medium text-sm">Nama:</span>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                {user.nama || "N/A"}
              </span>
              <span className="font-medium text-sm">NIM:</span>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                {user.nim || "N/A"}
              </span>
              <span className="font-medium text-sm">Angkatan:</span>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                {user.angkatan || "N/A"}
              </span>
              <span className="font-medium text-sm">Dosen Wali:</span>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                {user.dosenWali || "N/A"}
              </span>
            </div>
          </div>

          {/* <div className="flex flex-col items-center mt-4">
            <div className="flex flex-wrap justify-center">
              {semesterData.map((semester, index) => (
                <Dialog key={index}>
                  <DialogTrigger
                    className={`p-3 rounded-md cursor-pointer text-lg ${getButtonColor(
                      semester
                    )}`}
                  >
                    {index + 1}
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Detail Progress</DialogTitle>
                      <Tabs defaultValue="irs" className="w-[400px]">
                        <TabsList>
                          <TabsTrigger value="irs">IRS</TabsTrigger>
                          <TabsTrigger value="khs">KHS</TabsTrigger>
                          <TabsTrigger value="pkl">PKL</TabsTrigger>
                          <TabsTrigger value="skripsi">Skripsi</TabsTrigger>
                        </TabsList>
                        <TabsContent value="irs">Detail IRS</TabsContent>
                        <TabsContent value="khs">Detail KHS</TabsContent>
                        <TabsContent value="pkl">Detail PKL</TabsContent>
                        <TabsContent value="skripsi">
                          Detail Skripsi
                        </TabsContent>
                      </Tabs>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </div> */}
        </CardContent>
        <CardFooter>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 ml-3 my-3">
            <div className="w-10 h-10 border border-solid border-black rounded-lg flex justify-center items-center">
              <Dialog>
                <DialogTrigger>1</DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Detail Progress</DialogTitle>
                    <Tabs defaultValue="account" className="w-[400px]">
                      <TabsList>
                        <TabsTrigger value="irs">IRS</TabsTrigger>
                        <TabsTrigger value="khs">KHS</TabsTrigger>
                      </TabsList>
                      <TabsContent value="irs">Detail IRS</TabsContent>
                      <TabsContent value="khs">Detail KHS</TabsContent>
                    </Tabs>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>

            <div className="w-10 h-10 border border-solid border-black rounded-lg flex justify-center items-center">
              <Dialog>
                <DialogTrigger>2</DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Detail Progress</DialogTitle>
                    <Tabs defaultValue="account" className="w-[400px]">
                      <TabsList>
                        <TabsTrigger value="irs">IRS</TabsTrigger>
                        <TabsTrigger value="khs">KHS</TabsTrigger>
                      </TabsList>
                      <TabsContent value="irs">Detail IRS</TabsContent>
                      <TabsContent value="khs">Detail KHS</TabsContent>
                    </Tabs>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>

            <div className="w-10 h-10 border border-solid border-black rounded-lg flex justify-center items-center">
              <Dialog>
                <DialogTrigger>3</DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Detail Progress</DialogTitle>
                    <Tabs defaultValue="account" className="w-[400px]">
                      <TabsList>
                        <TabsTrigger value="irs">IRS</TabsTrigger>
                        <TabsTrigger value="khs">KHS</TabsTrigger>
                      </TabsList>
                      <TabsContent value="irs">Detail IRS</TabsContent>
                      <TabsContent value="khs">Detail KHS</TabsContent>
                    </Tabs>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>

            <div className="w-10 h-10 border border-solid border-black rounded-lg flex justify-center items-center">
              <Dialog>
                <DialogTrigger>4</DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Detail Progress</DialogTitle>
                    <Tabs defaultValue="account" className="w-[400px]">
                      <TabsList>
                        <TabsTrigger value="irs">IRS</TabsTrigger>
                        <TabsTrigger value="khs">KHS</TabsTrigger>
                      </TabsList>
                      <TabsContent value="irs">Detail IRS</TabsContent>
                      <TabsContent value="khs">Detail KHS</TabsContent>
                    </Tabs>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>

            <div className="w-10 h-10 border border-solid border-black rounded-lg flex justify-center items-center">
              <Dialog>
                <DialogTrigger>5</DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Detail Progress</DialogTitle>
                    <Tabs defaultValue="account" className="w-[400px]">
                      <TabsList>
                        <TabsTrigger value="irs">IRS</TabsTrigger>
                        <TabsTrigger value="khs">KHS</TabsTrigger>
                      </TabsList>
                      <TabsContent value="irs">Detail IRS</TabsContent>
                      <TabsContent value="khs">Detail KHS</TabsContent>
                    </Tabs>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>

            <div className="w-10 h-10 border border-solid border-black rounded-lg flex justify-center items-center">
              <Dialog>
                <DialogTrigger>6</DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Detail Progress</DialogTitle>
                    <Tabs defaultValue="account" className="w-[400px]">
                      <TabsList>
                        <TabsTrigger value="irs">IRS</TabsTrigger>
                        <TabsTrigger value="khs">KHS</TabsTrigger>
                      </TabsList>
                      <TabsContent value="irs">Detail IRS</TabsContent>
                      <TabsContent value="khs">Detail KHS</TabsContent>
                    </Tabs>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>

            <div className="w-10 h-10 border border-solid border-black rounded-lg flex justify-center items-center">
              <Dialog>
                <DialogTrigger>7</DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Detail Progress</DialogTitle>
                    <Tabs defaultValue="account" className="w-[400px]">
                      <TabsList>
                        <TabsTrigger value="irs">IRS</TabsTrigger>
                        <TabsTrigger value="khs">KHS</TabsTrigger>
                      </TabsList>
                      <TabsContent value="irs">Detail IRS</TabsContent>
                      <TabsContent value="khs">Detail KHS</TabsContent>
                    </Tabs>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>

            <div className="w-10 h-10 border border-solid border-black rounded-lg flex justify-center items-center">
              <Dialog>
                <DialogTrigger>8</DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Detail Progress</DialogTitle>
                    <Tabs defaultValue="account" className="w-[400px]">
                      <TabsList>
                        <TabsTrigger value="irs">IRS</TabsTrigger>
                        <TabsTrigger value="khs">KHS</TabsTrigger>
                      </TabsList>
                      <TabsContent value="irs">Detail IRS</TabsContent>
                      <TabsContent value="khs">Detail KHS</TabsContent>
                    </Tabs>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>

            <div className="w-10 h-10 border border-solid border-black rounded-lg flex justify-center items-center">
              <Dialog>
                <DialogTrigger>9</DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Detail Progress</DialogTitle>
                    <Tabs defaultValue="account" className="w-[400px]">
                      <TabsList>
                        <TabsTrigger value="irs">IRS</TabsTrigger>
                        <TabsTrigger value="khs">KHS</TabsTrigger>
                      </TabsList>
                      <TabsContent value="irs">Detail IRS</TabsContent>
                      <TabsContent value="khs">Detail KHS</TabsContent>
                    </Tabs>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>

            <div className="w-10 h-10 border border-solid border-black rounded-lg flex justify-center items-center">
              <Dialog>
                <DialogTrigger>10</DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Detail Progress</DialogTitle>
                    <Tabs defaultValue="account" className="w-[400px]">
                      <TabsList>
                        <TabsTrigger value="irs">IRS</TabsTrigger>
                        <TabsTrigger value="khs">KHS</TabsTrigger>
                      </TabsList>
                      <TabsContent value="irs">Detail IRS</TabsContent>
                      <TabsContent value="khs">Detail KHS</TabsContent>
                    </Tabs>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>

            <div className="w-10 h-10 border border-solid border-black rounded-lg flex justify-center items-center">
              <Dialog>
                <DialogTrigger>11</DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Detail Progress</DialogTitle>
                    <Tabs defaultValue="account" className="w-[400px]">
                      <TabsList>
                        <TabsTrigger value="irs">IRS</TabsTrigger>
                        <TabsTrigger value="khs">KHS</TabsTrigger>
                      </TabsList>
                      <TabsContent value="irs">Detail IRS</TabsContent>
                      <TabsContent value="khs">Detail KHS</TabsContent>
                    </Tabs>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>

            <div className="w-10 h-10 border border-solid border-black rounded-lg flex justify-center items-center">
              <Dialog>
                <DialogTrigger>12</DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Detail Progress</DialogTitle>
                    <Tabs defaultValue="account" className="w-[400px]">
                      <TabsList>
                        <TabsTrigger value="irs">IRS</TabsTrigger>
                        <TabsTrigger value="khs">KHS</TabsTrigger>
                      </TabsList>
                      <TabsContent value="irs">Detail IRS</TabsContent>
                      <TabsContent value="khs">Detail KHS</TabsContent>
                    </Tabs>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>

            <div className="w-10 h-10 border border-solid border-black rounded-lg flex justify-center items-center">
              <Dialog>
                <DialogTrigger>13</DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Detail Progress</DialogTitle>
                    <Tabs defaultValue="account" className="w-[400px]">
                      <TabsList>
                        <TabsTrigger value="irs">IRS</TabsTrigger>
                        <TabsTrigger value="khs">KHS</TabsTrigger>
                      </TabsList>
                      <TabsContent value="irs">Detail IRS</TabsContent>
                      <TabsContent value="khs">Detail KHS</TabsContent>
                    </Tabs>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>

            <div className="w-10 h-10 border border-solid border-black rounded-lg flex justify-center items-center">
              <Dialog>
                <DialogTrigger>14</DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Detail Progress</DialogTitle>
                    <Tabs defaultValue="account" className="w-[400px]">
                      <TabsList>
                        <TabsTrigger value="irs">IRS</TabsTrigger>
                        <TabsTrigger value="khs">KHS</TabsTrigger>
                      </TabsList>
                      <TabsContent value="irs">Detail IRS</TabsContent>
                      <TabsContent value="khs">Detail KHS</TabsContent>
                    </Tabs>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardFooter>
      </Card>
    </>
  );
};

export default MahasiswaCard;
