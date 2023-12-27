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
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function DashboardPage() {
  const [totalAkunData, setTotalAkunData] = useState(null);
  const [totalAkunMahasiswaData, setTotalAkunMahasiswaData] = useState(null);
  const [totalAkunDosenData, setTotalAkunDosenData] = useState(null);
  const [totalMahasiswaData, setTotalMahasiswaData] = useState(null);
  const [totalMahasiswaAktifData, setTotalMahasiswaAktifData] = useState(null);
  const [totalMahasiswaLulusData, setTotalMahasiswaLulusData] = useState(null);
  const [totalMahasiswaCutiData, setTotalMahasiswaCutiData] = useState(null);
  const [totalMahasiswaMangkirData, setTotalMahasiswaMangkirData] =
    useState(null);
  const [totalMahasiswaDOData, setTotalMahasiswaDOData] = useState(null);
  const [totalMahasiswaUndurData, setTotalMahasiswaUndurData] = useState(null);
  const [totalMahasiswaMeninggalData, setTotalMahasiswaMeninggalData] =
    useState(null);
  const router = useRouter();
  const { data: session } = useSession();
  const accessToken = session?.user?.access_token;

  const fetchDataDashboard = async () => {
    try {
      const response = await axios.get("http://localhost:8080/operator", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log(response.data);

      const dataDashboard = response.data;

      setTotalAkunData(dataDashboard.sumAccount);
      setTotalAkunMahasiswaData(dataDashboard.sumMahasiswa);
      setTotalAkunDosenData(dataDashboard.sumDosen);
      setTotalMahasiswaData(dataDashboard.sumMahasiswa);
      setTotalMahasiswaAktifData(dataDashboard.sumAktif);
      setTotalMahasiswaLulusData(dataDashboard.sumLulus);
      setTotalMahasiswaCutiData(dataDashboard.sumCuti);
      setTotalMahasiswaMangkirData(dataDashboard.sumMangkir);
      setTotalMahasiswaDOData(dataDashboard.sumDO);
      setTotalMahasiswaUndurData(dataDashboard.sumUndurDiri);
      setTotalMahasiswaMeninggalData(dataDashboard.sumMeninggalDunia);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (session) {
      fetchDataDashboard();
    }
  }, [session]);

  const handleButtonClick = () => {
    // Navigate to "/admin/generate" when the button is clicked
    router.push("/admin/generate");
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
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div>
            <div className="flex items-start mt-5 mb-2">
              <h2 className="text-xl font-bold">Summary Akun</h2>
              <div className="ml-auto">
                <Button onClick={handleButtonClick}>
                  <Plus className="mr-2 h-4 w-4" /> Generate Akun
                </Button>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3 ml-3 my-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Akun
                </CardTitle>
                {/* Add appropriate icon or styling here */}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalAkunData}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Akun Mahasiswa{" "}
                </CardTitle>
                {/* Add appropriate icon or styling here */}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {totalAkunMahasiswaData}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Akun Dosen
                </CardTitle>
                {/* Add appropriate icon or styling here */}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalAkunDosenData}</div>
              </CardContent>
            </Card>
          </div>

          <div>
            <div className="flex items-start mt-10 mb-2">
              <h2 className="text-xl font-bold tracking-tight">
                Status Mahasiswa
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Mahasiswa
                  </CardTitle>
                  {/* Add appropriate icon or styling here */}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalMahasiswaData}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Mahasiswa Aktif
                  </CardTitle>
                  {/* Add appropriate icon or styling here */}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {totalMahasiswaAktifData}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Mahasiswa Lulus
                  </CardTitle>
                  {/* Add appropriate icon or styling here */}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {totalMahasiswaLulusData}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Mahasiswa Cuti
                  </CardTitle>
                  {/* Add appropriate icon or styling here */}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {totalMahasiswaCutiData}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Mahasiswa Mangkir
                  </CardTitle>
                  {/* Add appropriate icon or styling here */}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {totalMahasiswaMangkirData}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Mahasiswa DO
                  </CardTitle>
                  {/* Add appropriate icon or styling here */}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {totalMahasiswaDOData}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Mahasiswa Undur Diri
                  </CardTitle>
                  {/* Add appropriate icon or styling here */}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {totalMahasiswaUndurData}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Mahasiswa Meninggal Dunia
                  </CardTitle>
                  {/* Add appropriate icon or styling here */}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {totalMahasiswaMeninggalData}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
