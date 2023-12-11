import { Metadata } from "next";
import Image from "next/image";
import { z } from "zod";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptionConfig";
import axios from "axios";
import { getServerSession } from "next-auth";

import { columns } from "@/components/table/IRS/columns";
import { DataTable } from "@/components/table/IRS/data-table";
import { verifikasiSchema } from "@/components/data/tabel/tabelIRS/schema";

import { PKLSchema } from "@/components/data/tabel/tabelPKL/schema";
import { PKLColumns } from "@/components/table/PKL/columns";
import { DataTablePKL } from "@/components/table/PKL/data-table";

import { KHSColumns } from "@/components/table/KHS/columns";
import { DataTableKHS } from "@/components/table/KHS/data-table";
import { KHSSchema } from "@/components/data/tabel/tabelKHS/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Verifikasi Berkas",
  description: "Verifikasi Berkas",
};

async function getDataVerifikasiIRS() {
  try {
    const session = await getServerSession(authOptions);
    console.log(session);

    const accessToken = session?.user?.access_token;

    console.log(accessToken);

    const response = await axios.get(
      "http://localhost:8080/dosen/irs/getIRSBelumByDosen",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log(response.data);

    const dataVerifikasi = response.data;

    return z.array(verifikasiSchema).parse(dataVerifikasi);
  } catch (error) {
    console.error("Error fetching or parsing data:", error);
    return [];
  }
}

async function getDataVerifikasiKHS() {
  try {
    const session = await getServerSession(authOptions);
    console.log(session);

    const accessToken = session?.user?.access_token;

    console.log(accessToken);

    const response = await axios.get(
      "http://localhost:8080/dosen/khs/getKHSBelumByDosen",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log(response.data);

    const dataKHS = response.data;

    return z.array(KHSSchema).parse(dataKHS);
  } catch (error) {
    console.error("Error fetching or parsing data:", error);
    return [];
  }
}

async function getDataVerifikasiPKL() {
  try {
    const session = await getServerSession(authOptions);
    console.log(session);

    const accessToken = session?.user?.access_token;

    console.log(accessToken);

    const response = await axios.get(
      "http://localhost:8080/dosen/pkl/getPKLBelumByDosen",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log(response.data);

    const dataPKL = response.data;

    return z.array(PKLSchema).parse(dataPKL);
  } catch (error) {
    console.error("Error fetching or parsing data:", error);
    return [];
  }
}

async function getDataVerifikasiSkripsi() {
  try {
    const session = await getServerSession(authOptions);
    console.log(session);

    const accessToken = session?.user?.access_token;

    console.log(accessToken);

    const response = await axios.get(
      "http://localhost:8080/dosen/skripsi/getSkripsiBelumByDosen",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log(response.data);

    const dataSkripsi = response.data;

    return z.array(PKLSchema).parse(dataSkripsi);
  } catch (error) {
    console.error("Error fetching or parsing data:", error);
    return [];
  }
}
export default async function VerifikasiPage() {
  const dataVerifikasiIRS = await getDataVerifikasiIRS();
  const dataVerifikasiPKL = await getDataVerifikasiPKL();
  const dataVerifikasiKHS = await getDataVerifikasiKHS();
  const dataVerifikasiSkripsi = await getDataVerifikasiSkripsi();
  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/tasks-light.png"
          width={1280}
          height={998}
          alt="Playground"
          className="block dark:hidden w-full h-auto"
        />
        <Image
          src="/examples/tasks-dark.png"
          width={1280}
          height={998}
          alt="Playground"
          className="hidden dark:block w-full h-auto"
        />
      </div>
      <div className="hidden h-full w-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Verifikasi Berkas
            </h2>
            <p className="text-gray-500">By dosen</p>
          </div>
          <div className="flex items-center space-x-2"></div>
        </div>
        <Tabs defaultValue="irs">
          <TabsList className="grid w-full grid-cols-4 gap-2">
            <TabsTrigger value="irs">IRS</TabsTrigger>
            <TabsTrigger value="khs">KHS</TabsTrigger>
            <TabsTrigger value="pkl">PKL</TabsTrigger>
            <TabsTrigger value="skripsi">Skripsi</TabsTrigger>
          </TabsList>

          <TabsContent value="irs">
            <Card className="w-full mx-auto p-6 rounded-lg shadow-xl bg-white dark:bg-zinc-900">
              <CardHeader>
                <CardTitle>IRS</CardTitle>
                <CardDescription>Verifikasi Berkas IRS</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <DataTable data={dataVerifikasiIRS} columns={columns} />
              </CardContent>
              <CardFooter></CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="khs">
          <Card className="w-full mx-auto p-6 rounded-lg shadow-xl bg-white dark:bg-zinc-900">
              <CardHeader>
                <CardTitle>KHS</CardTitle>
                <CardDescription>Verifikasi KHS </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <DataTableKHS data={dataVerifikasiKHS} columns={KHSColumns} />
              </CardContent>
              <CardFooter></CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="pkl">
          <Card className="w-full mx-auto p-6 rounded-lg shadow-xl bg-white dark:bg-zinc-900">
              <CardHeader>
                <CardTitle>PKL</CardTitle>
                <CardDescription>Verifikasi PKL </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <DataTablePKL data={dataVerifikasiPKL} columns={PKLColumns} />
              </CardContent>
              <CardFooter></CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="skripsi">
          <Card className="w-full mx-auto p-6 rounded-lg shadow-xl bg-white dark:bg-zinc-900">
              <CardHeader>
                <CardTitle>Skripsi</CardTitle>
                <CardDescription>Verifikasi Skripsi </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <DataTable data={dataVerifikasiSkripsi} columns={PKLColumns} />
              </CardContent>
              <CardFooter>{/* Add your button content here */}</CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
