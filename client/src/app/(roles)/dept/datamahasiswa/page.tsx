import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptionConfig";
import Image from "next/image";
import { z } from "zod";
import axios from "axios";
import { columns } from "@/components/table/DataMahasiswa/columns";
import { DataTable } from "@/components/table/DataMahasiswa/data-table";
import { mahasiswaSchema } from "@/components/data/tabel/tabelDataMahasiswa/schema";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";

export const metadata: Metadata = {
  title: "Data Mahasiswa",
  description: "List Data Mahasiswa",
};

 async function getDataMahasiswa() {
  try {
    const session = await getServerSession(authOptions);
    console.log(session);

    const accessToken = session?.user?.access_token;

    console.log(accessToken);

    const response = await axios.get(
      "http://localhost:8080/master/getAllMahasiswa",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const dataMahasiswa = response.data;

    return z.array(mahasiswaSchema).parse(dataMahasiswa);
  } catch (error) {
    console.error("Error fetching or parsing data:", error);
    return [];
  }
}


export default async function DataMahasiswaPage() {
  const dataMahasiswa = await getDataMahasiswa();

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
            <h2 className="text-2xl font-bold tracking-tight">
              Data Mahasiswa
            </h2>
            <p className="text-muted-foreground">Data mahasiswa</p>
          </div>
          <div className="flex items-center space-x-2"></div>
        </div>
          <DataTable data={dataMahasiswa} columns={columns} />
      </div>
    </>
  );
}
