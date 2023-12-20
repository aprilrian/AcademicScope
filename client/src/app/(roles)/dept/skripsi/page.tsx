"use client";

import React, { PureComponent } from "react";

import CustomPieChart from "@/components/charts/PieChart";
import CustomBarChart from "@/components/charts/IPKBarChart";

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
  const dummyRekapProgress: any = {
    tahun: {
      "2016": {
        sudah: 15,
        belum: 5,
      },
      "2017": {
        sudah: 20,
        belum: 10,
      },
      "2018": {
        sudah: 25,
        belum: 15,
      },
      "2019": {
        sudah: 30,
        belum: 20,
      },
      "2020": {
        sudah: 35,
        belum: 25,
      },
      "2021": {
        sudah: 40,
        belum: 30,
      },
      "2022": {
        sudah: 45,
        belum: 35,
      },
    },
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
      <div className="hidden flex-col md:flex">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <div className="ml-auto flex items-center space-x-4"></div>
          </div>
        </div>
        <Card className="mx-4">
          <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">
                Rekap Progress Skripsi Mahasiswa Informatika Fakultas Sains dan
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
              </TabsList>
              <TabsContent value="angkatan" className="space-y-4">
                <div className="flex items-center justify-between">
                  <Card className="p-4 bg-gray-100 rounded-md shadow-md w-full">
                    <CardHeader>
                      <CardTitle>Angkatan</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {dummyRekapProgress.angkatan}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              {Object.keys(dummyRekapProgress.tahun).map((tahun) => (
                <TabsContent key={tahun} value={tahun} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card className="p-4 bg-green-600 rounded-md shadow-md">
                      <CardHeader>
                        <CardTitle>Sudah</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {dummyRekapProgress.tahun[tahun].sudah}
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="p-4 bg-red-600 rounded-md shadow-md">
                      <CardHeader>
                        <CardTitle>Belum</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {dummyRekapProgress.tahun[tahun].belum}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </Card>
      </div>
    </>
  );
}
