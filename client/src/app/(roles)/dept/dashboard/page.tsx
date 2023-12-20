"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { LineChart } from "@mui/x-charts/LineChart";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useSession } from "next-auth/react";

const summarys = [
  { value: "ipk", label: "IPK" },
  { value: "irs", label: "IRS" },
  { value: "khs", label: "KHS" },
  { value: "pkl", label: "PKL" },
  { value: "skripsi", label: "Skripsi" },
];

const angkatans = [
  { value: "3", label: "2021" },
  { value: "2017", label: "2017" },
  { value: "2018", label: "2018" },
  { value: "2019", label: "2019" },
  { value: "2020", label: "2020" },
  { value: "2021", label: "2021" },
  { value: "2022", label: "2022" },
  { value: "2023", label: "2023" },
];

export default function DashboardPage() {
  const [open, setOpen] = React.useState(false);
  const [opens, setOpens] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [values, setValues] = React.useState("");
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
  const { data: session } = useSession();
  const accessToken = session?.user?.access_token;
  const [graphData, setGraphData] = useState([]);

  useEffect(() => {
    const fetchDataDashboard = async () => {
      try {
        const response = await axios.get("http://localhost:8080/departemen", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

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
          "http://localhost:8080/departemen/graphBoard",
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

    if (session) {
      fetchDataDashboard();
      fetchGraphData();
    }
  }, [session, accessToken]);

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
          {/* ... (other JSX) */}
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

          <div>
            <div className="flex items-start mt-10 mb-2">
              <div className="ml-auto">
                <Popover open={opens} onOpenChange={setOpens}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={opens}
                      className="w-[200px] justify-between"
                    >
                      {values
                        ? angkatans.find(
                            (angkatan) => angkatan.value === values
                          )?.label
                        : "Pilih angkatan"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      {/* <CommandInput placeholder="Search angkatan..." /> */}
                      {/* <CommandEmpty>No angkatan found.</CommandEmpty> */}
                      <CommandGroup>
                        {angkatans.map((angkatan) => (
                          <CommandItem
                            key={angkatan.value}
                            value={angkatan.value}
                            onSelect={(currentValue) => {
                              setValues(
                                currentValue === values ? "" : currentValue
                              );
                              setOpens(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                values === angkatan.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {angkatan.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
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
                    <div className="text-2xl font-bold">
                      {totalMahasiswaData}
                    </div>
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
      </div>
    </>
  );
}
