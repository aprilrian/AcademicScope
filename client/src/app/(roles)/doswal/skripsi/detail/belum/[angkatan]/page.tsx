import { promises as fs } from "fs";
import path from "path";
import { Metadata } from "next";
import Image from "next/image";
import { z } from "zod";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptionConfig";

import { PKLColumns } from "@/components/table/PKL/columns";
import { DataTablePKL } from "@/components/table/PKL/data-table";
import { PKLSchema } from "@/components/data/tabel/tabelPKL/schema";
import { getServerSession } from "next-auth";
import axios from "axios";
import { useParams } from "next/navigation";

export const metadata: Metadata = {
  title: "Detail PKL",
  description: "List detail PKL",
};

async function getDataPKL(params) {
  try {
    const session = await getServerSession(authOptions);
    const accessToken = session?.user?.access_token;
    const angkatan = `${params.angkatan}`;
    console.log(angkatan);

    const response = await axios.get(
      `http://localhost:8080/dosen/skripsi/rekap/belum_ambil/${angkatan}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const dataPkl = response.data;

    console.log(dataPkl);

    return z.array(PKLSchema).parse(dataPkl);
  } catch (error) {
    console.error("Error fetching or parsing data:", error);
    return [];
  }
}

export default async function pklPage() {
  const params = {}; // Add an initializer for the 'params' property
  const dataPKL = await getDataPKL({ params });

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
            <h2 className="text-2xl font-bold tracking-tight">Data PKL</h2>
            <p className="text-muted-foreground">Data PKL</p>
          </div>
          <div className="flex items-center space-x-2"></div>
        </div>
        <DataTablePKL data={dataPKL} columns={PKLColumns} />
      </div>
    </>
  );
}
