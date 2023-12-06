"use client";

import React, { PureComponent, useEffect, useState } from "react";

import CustomPieChart from "@/components/charts/PieChart";
import CustomBarChart from "@/components/charts/BarChart";

import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DashboardPage() {
  const [irsData, setIrsData] = useState(null);
  const [khsData, setKhsData] = useState(null);
  const [pklData, setPklData] = useState(null);
  const [skripsiData, setSkripsiData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const irs = await fetchIRSData(); // Implement fetchIRSData function
        const khs = await fetchKHSData(); // Implement fetchKHSData function
        const pkl = await fetchPKLData(); // Implement fetchPKLData function
        const skripsi = await fetchSkripsiData(); // Implement fetchSkripsiData function

        setIrsData(irs);
        setKhsData(khs);
        setPklData(pkl);
        setSkripsiData(skripsi);
      } catch (error) {
        // Handle errors appropriately
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures the effect runs only once on mount

  // Placeholder functions for data fetching
  const fetchIRSData = async () => {
    // Replace with actual logic to fetch IRS data
    return "Semester 2";
  };

  const fetchKHSData = async () => {
    // Replace with actual logic to fetch KHS data
    return "3.75"; // Example IPK
  };

  const fetchPKLData = async () => {
    // Replace with actual logic to fetch PKL data
    return "Completed"; // Example status
  };

  const fetchSkripsiData = async () => {
    // Replace with actual logic to fetch Skripsi data
    return "Not Completed"; // Example status
  };
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
      <div className="hidden flex-col md:flex  bg-gray-100 dark:bg-gray-800">
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
                    {/* Additional information if needed */}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      KHS (IPK)
                    </CardTitle>
                    {/* Add appropriate icon or styling here */}
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{khsData}</div>
                    {/* Additional information if needed */}
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
                    {/* Additional information if needed */}
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
                    {/* Additional information if needed */}
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <CustomBarChart></CustomBarChart>
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Recent Sales</CardTitle>
                    <CardDescription>Jalur Masuk</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CustomPieChart></CustomPieChart>
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
