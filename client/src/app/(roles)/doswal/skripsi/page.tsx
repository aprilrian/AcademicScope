"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import CustomBarChart from "@/components/charts/IPKBarChart";
import axios from "axios";
import { useSession } from "next-auth/react";

// Define the type for your state
interface RekapProgress {
  tahun: Record<string, { sudah: number; belum: number }>;
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const accessToken = session?.user?.access_token;
  // Specify the type for the state
  const [rekapProgress, setRekapProgress] = useState<RekapProgress | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/dosen/skripsi/rekap",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const data = response.data;
        setRekapProgress({
          tahun: data.tahun,
        });

        console.log(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [accessToken]);

  if (rekapProgress === null) {
    return <div>Loading...</div>; // You can replace this with a loading indicator or any other appropriate UI
  }

  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/dashboard-light.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="block dark:hidden"
        />
        <Image
          src="/examples/dashboard-dark.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden flex-col md:flex  bg-gray-100">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <div className="ml-auto flex items-center space-x-4"></div>
          </div>
        </div>
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              Rekap Progress PKL Mahasiswa Informatika Fakultas Sains dan
              Matematika UNDIP Semarang{" "}
            </h2>
            <div className="flex items-center space-x-2"></div>
          </div>
          <Tabs defaultValue="angkatan" className="space-y-4">
            <TabsList>
              <TabsTrigger value="2016">2016</TabsTrigger>
              <TabsTrigger value="2017">2017</TabsTrigger>
              <TabsTrigger value="2018">2018</TabsTrigger>
              <TabsTrigger value="2019">2019</TabsTrigger>
              <TabsTrigger value="2020">2020</TabsTrigger>
              <TabsTrigger value="2021">2021</TabsTrigger>
              <TabsTrigger value="2022">2022</TabsTrigger>
              <TabsTrigger value="2023">2023</TabsTrigger>
            </TabsList>
            <TabsContent value="angkatan" className="space-y-4">
              <CustomBarChart></CustomBarChart>
            </TabsContent>

            {Object.keys(rekapProgress.tahun).map((tahun) => (
              <TabsContent key={tahun} value={tahun} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Add onClick to the wrapping div or directly to the Card */}
                  <div
                    onClick={() =>
                      router.push(`/doswal/skripsi/detail/sudah/${tahun}`)
                    }
                  >
                    <Card className="bg-green-600">
                      <CardHeader>
                        <CardTitle>Sudah</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {rekapProgress.tahun[tahun].sudah}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  {/* Similarly, add onClick to the wrapping div or directly to the Card */}
                  <div
                    onClick={() =>
                      router.push(`/doswal/skripsi/detail/belum/${tahun}`)
                    }
                  >
                    <Card className="bg-red-600">
                      <CardHeader>
                        <CardTitle>Belum</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {rekapProgress.tahun[tahun].belum}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </>
  );
}
