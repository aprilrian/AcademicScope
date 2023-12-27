"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { LineChart } from "@mui/x-charts/LineChart";
import axios from "axios";

export default function DashboardPage() {
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
  const [graphData, setGraphData] = useState([]);
  const { data: session } = useSession();
  const accessToken = session?.user?.access_token;

  const fetchDataDashboard = async () => {
    try {
      const response = await axios.get("http://localhost:8080/dosen", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log(response.data);

      const dataDashboard = response.data;

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

  const fetchGraphData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/dosen/ipkGraphDosenBoard",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const graphData = response.data.map((item) => ({
        label: item.label,
        value: item.value,
      }));

      setGraphData(graphData);
    } catch (error) {
      console.error("Error fetching graph data:", error);
    }
  };

  useEffect(() => {
    if (session) {
      fetchDataDashboard();
      fetchGraphData();
    }
  }, [session, accessToken]);

  return (
    <>
      <div className="md:hidden">{/* ... (Image components) */}</div>

      <div className="hidden flex-col md:flex">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <div className="flex items-center space-x-2"></div>
          </div>
          <div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Grafik Indeks Prestasi Kumulatif</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  {graphData.length > 0 ? (
                    <LineChart
                      xAxis={[
                        {
                          data: graphData.map((item) => item.label),
                          scaleType: "point",
                        },
                      ]}
                      series={[
                        {
                          curve: "linear",
                          data: graphData.map((item) => item.value),
                        },
                      ]}
                      min-width={500}
                      max-width={600}
                      height={400}
                    />
                  ) : (
                    <p>No data available for the chart.</p>
                  )}
                </CardContent>
              </Card>
            </div>
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
