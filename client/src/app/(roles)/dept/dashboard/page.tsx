"use client";

import React, { PureComponent } from "react";
import { jsx } from '@emotion/react';

import CustomPieChart from "@/components/charts/PieChart";
import CustomBarChart from "@/components/charts/BarChart";
import { LineChart } from '@mui/x-charts/LineChart';


import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Check, ChevronsUpDown } from "lucide-react"
 
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const summarys = [
  {
    value: "ipk",
    label: "IPK",
  },
  {
    value: "irs",
    label: "IRS",
  },
  {
    value: "khs",
    label: "KHS",
  },
  {
    value: "pkl",
    label: "PKL",
  },
  {
    value: "skripsi",
    label: "Skripsi",
  },
]

const angkatans = [
  {
    value: "2016",
    label: "2016",
  },
  {
    value: "2017",
    label: "2017",
  },
  {
    value: "2018",
    label: "2018",
  },
  {
    value: "2019",
    label: "2019",
  },
  {
    value: "2020",
    label: "2020",
  },
  {
    value: "2021",
    label: "2021",
  },
  {
    value: "2022",
    label: "2022",
  },
  {
    value: "2023",
    label: "2023",
  },
]

export default function DashboardPage() {
  const [open, setOpen] = React.useState(false)
  const [opens, setOpens] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [values, setValues] = React.useState("")

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
{/* 
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <div className="flex items-center space-x-2"></div>
          </div> */}
{/* 
          <div className="border-b">
              <div className="ml-auto flex items-center space-x-4"></div>
          </div> */}

          <div>
          <div className="hidden flex-col md:flex items-center justify-center">
              <div className="ml-auto">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-[200px] justify-between"
                    >
                      {value
                        ? summarys.find((framework) => framework.value === value)?.label
                        : "Pilih summary"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      {/* <CommandInput placeholder="Search framework..." />
                      <CommandEmpty>No framework found.</CommandEmpty> */}
                      <CommandGroup>
                        {summarys.map((framework) => (
                          <CommandItem
                            key={framework.value}
                            value={framework.value}
                            onSelect={(currentValue) => {
                              setValue(currentValue === value ? "" : currentValue)
                              setOpen(false)
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                value === framework.value ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {framework.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Grafik Indeks Prestasi Kumulatif</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                <LineChart
                  xAxis={[{ 
                    data: [2016, 2017, 2018, 2019, 2020, 2021, 2022],
                    scaleType: 'point', }]}
                  series={[
                    {
                      curve: "linear",
                      data: [3, 3.8, 3.3, 3.5, 3.6, 3.2, 4],
                    },
                  ]}
                  min-width={500}
                  max-width={600}
                  height={400}
                />
                </CardContent>
              </Card>
            </div>
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
                        ? angkatans.find((angkatan) => angkatan.value === values)?.label
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
                              setValues(currentValue === values ? "" : currentValue)
                              setOpens(false)
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                values === angkatan.value ? "opacity-100" : "opacity-0"
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

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Mahasiswa
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">174</div>
                  <p className="text-xs text-muted-foreground">
                    Mahasiswa
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Mahasiswa Aktif
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">40</div>
                  <p className="text-xs text-muted-foreground">
                    Mahasiswa
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Mahasiswa Lulus</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">70</div>
                  <p className="text-xs text-muted-foreground">
                    mahasiswa
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Mahasiswa Cuti
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-xs text-muted-foreground">
                    Mahasiswa
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Mahasiswa Mangkir
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">
                    Mahasiswa
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Mahasiswa DO
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">
                    Mahasiswa 
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Mahasiswa Undur Diri
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-xs text-muted-foreground">
                    Mahasiswa
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Mahasiswa Meninggal Dunia
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">
                    Mahasiswa
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}