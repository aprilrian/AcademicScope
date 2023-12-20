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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";

const dummyUserData = {
  nama: "Nathan Nadeak",
  nim: "24060121140120",
  angkatan: "2021",
  dosenWali: "Eko Adi Sarwoko",
  image: "/john_doe_avatar.jpg",
  role: "Mahasiswa",
  email: "john.doe@example.com",
};

const getStatusColor = (semester: any) => {
  const statusMap = {
    belumDiisikan: "bg-red-400",
    sudahDiisikan: "bg-blue-400",
    lulusPKL: "bg-yellow-400",
    lulusSkripsi: "bg-green-400",
  };

  if (semester.skripsi_status) {
    return statusMap.lulusSkripsi;
  } else if (semester.pkl_status) {
    return statusMap.lulusPKL;
  } else if (semester.irs_status && semester.khs_status) {
    return statusMap.sudahDiisikan;
  } else {
    return statusMap.belumDiisikan;
  }
};

const getStatusDescription = (semesterData: any) => {
  const hasSkripsiStatus = semesterData.some(
    (semester) => semester.skripsi_status
  );
  const hasIrsKhsPklStatus = semesterData.some(
    (semester) =>
      semester.irs_status && semester.khs_status && semester.pkl_status
  );
  const hasIrsKhsStatus = semesterData.some(
    (semester) => semester.irs_status && semester.khs_status
  );

  if (hasSkripsiStatus) {
    return { text: "Lulus Skripsi", color: "text-green-500" };
  } else if (hasIrsKhsPklStatus) {
    return { text: "Lulus PKL", color: "text-yellow-500" };
  } else if (hasIrsKhsStatus) {
    return { text: "Sudah Diisikan", color: "text-blue-500" };
  } else {
    return { text: "Belum Diisikan", color: "text-red-500" };
  }
};

const MahasiswaCard = ({ params }) => {
  const [user, setUser] = useState(dummyUserData);
  const [semesterData, setSemesterData] = useState([]);
  const { data: session } = useSession();
  const accessToken = session?.user?.access_token;
  const router = useRouter();
  const nim = `${params.nim}`;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/dosen/preDetail/${nim}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.status === 200) {
          const userProfile = response.data;
          setUser(userProfile);
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
          `http://localhost:8080/dosen/detail/${nim}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setSemesterData(response.data);
      } catch (error) {
        console.error("Error fetching semester data:", error);
      }
    };

    fetchUserData();
    fetchSemesterData();
  }, [nim, accessToken]);

  const handleViewDetailKHS = (semester: any) => {
    // Assuming `khs_file` is a property in the `semester` object
    const khsFileUrl = `http://localhost:8080/${semester.khs_file}`;

    // Open a new window or tab with the specified URL
    window.open(khsFileUrl);
  };

  const handleViewDetailIRS = (semester: any) => {
    // Assuming `khs_file` is a property in the `semester` object
    const irsFileUrl = `http://localhost:8080/${semester.irs_file}`;

    // Open a new window or tab with the specified URL
    window.open(irsFileUrl);
  };

  return (
    <>
      <Card className="mx-4 my-4 p-6 rounded-lg shadow-xl bg-white dark:bg-zinc-900">
        <CardHeader>
          <CardTitle className="text-center text-xl">
            Progress Perkembangan Studi Mahasiswa Informatika Fakultas Sains dan
            Matematika UNDIP Semarang
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage
                alt="User Avatar"
                src={`http://localhost:8080/${user.image}`}
              />
              <AvatarFallback>
                {user.nama && user.nama.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h2 className="text-2xl font-bold">{user.nama || "N/A"}</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {user.role || "N/A"}
              </p>
            </div>
          </div>
          <div className="mt-8 border-t pt-6 space-y-2 flex flex-col">
            <div className="flex justify-between">
              <div className="flex flex-col">
                <span className="font-medium text-sm">Nama:</span>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  {user.nama || "N/A"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-sm">NIM:</span>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  {user.nim || "N/A"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-sm">Angkatan:</span>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  {user.angkatan || "N/A"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-sm">Dosen Wali:</span>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  {user.dosenWali || "N/A"}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 ml-3 my-3">
            {semesterData.map((semester, index) => (
              <div
                key={index}
                className={`w-10 h-10 border border-solid border-black rounded-lg flex justify-center items-center ${getStatusColor(
                  semester
                )}`}
              >
                <Dialog>
                  <DialogTrigger>{index + 1}</DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Detail Progress</DialogTitle>
                      <Tabs defaultValue="irs" className="w-[400px]">
                        <TabsList>
                          <TabsTrigger value="irs">IRS</TabsTrigger>
                          <TabsTrigger value="khs">KHS</TabsTrigger>
                        </TabsList>
                        <TabsContent value="irs">
                          <div>
                            <table className="w-full">
                              <tbody>
                                <tr>
                                  <td className="font-medium">Semester:</td>
                                  <td>{semester.semester || "N/A"}</td>
                                </tr>
                                <tr>
                                  <td className="font-medium">SKS:</td>
                                  <td>{semester.sks || "N/A"}</td>
                                </tr>
                              </tbody>
                            </table>
                            <button
                              onClick={() => handleViewDetailIRS(semester)}
                              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
                            >
                              View Detail
                            </button>
                          </div>
                        </TabsContent>
                        <TabsContent value="khs">
                          <div>
                            <table className="w-full">
                              <tbody>
                                <tr>
                                  <td className="font-medium">SKS Semester:</td>
                                  <td>{semester.sks_semester || "N/A"}</td>
                                </tr>
                                <tr>
                                  <td className="font-medium">IP Semester:</td>
                                  <td>{semester.ip_semester || "N/A"}</td>
                                </tr>
                                <tr>
                                  <td className="font-medium">
                                    SKS Kumulatif:
                                  </td>
                                  <td>{semester.sks_kumulatif || "N/A"}</td>
                                </tr>
                                <tr>
                                  <td className="font-medium">IP Kumulatif:</td>
                                  <td>{semester.ip_kumulatif || "N/A"}</td>
                                </tr>
                              </tbody>
                            </table>
                            <button
                              onClick={() => handleViewDetailKHS(semester)}
                              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
                            >
                              View Detail
                            </button>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm">
              Keterangan Warna:
              <span className="ml-2 text-green-500">Lulus Skripsi</span>
              <span className="ml-2 text-yellow-500">Lulus PKL</span>
              <span className="ml-2 text-blue-500">Sudah Diisikan</span>
              <span className="ml-2 text-red-500">Belum Diisikan</span>
            </p>
          </div>
        </CardFooter>
      </Card>
    </>
  );
};

export default MahasiswaCard;
