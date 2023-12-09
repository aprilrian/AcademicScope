import { promises as fs } from "fs";
import path from "path";
import { Metadata } from "next";
import Image from "next/image";
import { z } from "zod";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptionConfig";
import { columns } from "@/components/table/VerifikasiBerkas/columns";
import { DataTable } from "@/components/table/VerifikasiBerkas/data-table";
import { verifikasiSchema } from "@/components/data/tabel/tabelVerifikasi/schema";
import axios from "axios";
import { getServerSession } from "next-auth";

export const metadata: Metadata = {
  title: "Verifikasi Berkas",
  description: "Verifikasi Berkas",
};

async function getDataVerifikasi() {
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

export default async function VerifikasiPage() {
  const dataVerifikasi = await getDataVerifikasi();
  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/tasks-light.png"
          width={1280}
          height={998}
          alt="Playground"
          className="block dark:hidden"
        />
        <Image
          src="/examples/tasks-dark.png"
          width={1280}
          height={998}
          alt="Playground"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Data IRS</h2>
            <p className="text-muted-foreground">Data IRS</p>
          </div>
          <div className="flex items-center space-x-2"></div>
        </div>
        <DataTable data={dataVerifikasi} columns={columns} />
      </div>
    </>
  );
}
