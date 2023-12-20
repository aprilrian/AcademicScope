"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import CustomPieChart from "@/components/charts/PieChart";
import IPKBarChart from "@/components/charts/IPKBarChart";

import Image from "next/image";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const [irsData, setIrsData] = useState(null);
  const [khsData, setKhsData] = useState(null);
  const [pklData, setPklData] = useState(null);
  const [skripsiData, setSkripsiData] = useState(null);
  const [irsStatus, setIRSStatus] = useState(null);
  const [khsStatus, setKHSStatus] = useState(null);
  const [pklStatus, setPklStatus] = useState(null);
  const [skripsiStatus, setSkripsiStatus] = useState(null);
  const { data: session } = useSession();
  const accessToken = session?.user?.access_token;

  const fetchDataDashboard = async () => {
    try {
      const response = await axios.get("http://localhost:8080/mahasiswa", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log(response.data);

      const dataDashboard = response.data;

      setIrsData(dataDashboard.semester);
      setKhsData(dataDashboard.ipk);
      setPklData(dataDashboard.pkl);
      setSkripsiData(dataDashboard.skripsi);
      setIRSStatus(dataDashboard.irs_statusV);
      setKHSStatus(dataDashboard.khs_statusV);
      setPklStatus(dataDashboard.pkl_statusV);
      setSkripsiStatus(dataDashboard.skripsi_statusV);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (session) {
      fetchDataDashboard();
    }
  }, [session]);

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
      <div className="hidden flex-col md:flex">
        {/* <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <div className="ml-auto flex items-center space-x-4"></div>
          </div>
        </div> */}
        <div className="flex-1 space-y-4 p-8 pt-6">
          {/* <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <div className="flex items-center space-x-2"></div>
          </div> */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      IRS (Semester)
                    </CardTitle>
                    {/* Add appropriate icon or styling here */}
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{irsData}</div>
                    <div className="text-sm text-gray-500">
                      Status Verifikasi: {irsStatus}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      KHS (IPK)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{khsData}</div>
                    <div className="text-sm text-gray-500">
                      Status Verifikasi: {khsStatus}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      PKL (Status)
                    </CardTitle>
                    {/* Add appropriate icon or styling here */}
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{pklData}</div>
                    <div className="text-sm text-gray-500">
                      Status Verifikasi: {pklStatus}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Skripsi (Status)
                    </CardTitle>
                    {/* Add appropriate icon or styling here */}
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{skripsiData}</div>
                    <div className="text-sm text-gray-500">
                      Status Verifikasi: {skripsiStatus}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Diagram IPK</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <IPKBarChart></IPKBarChart>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
