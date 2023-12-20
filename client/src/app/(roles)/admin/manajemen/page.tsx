import { Metadata } from "next";
import Image from "next/image";
import { z } from "zod";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptionConfig";

import { columns } from "@/components/table/ManajemenAkun/columns";
import { DataTable } from "@/components/table/ManajemenAkun/data-table";
import { manajemenSchema } from "@/components/data/tabel/tabelManajemenAkun/schema";
import { getServerSession } from "next-auth";
import axios from "axios";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Manajemen Akun",
  description: "Manajemen Akun",
};

async function getDataManajemen() {
  try {
    const session = await getServerSession(authOptions);
    console.log(session);

    const accessToken = session?.user?.access_token;

    console.log(accessToken);

    const response = await axios.get(
      "http://localhost:8080/operator/getAllAccount",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log(response.data);

    const dataManajamen = response.data;

    return z.array(manajemenSchema).parse(dataManajamen);
  } catch (error) {
    console.error("Error fetching or parsing data:", error);
    return [];
  }
}

export default async function ManajemenPage() {
  const dataManajemen = await getDataManajemen();

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
      <div className="hidden h-full w-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          {/* <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Manajemen Akun
            </h2>
            <p className="text-gray-500">By Operator</p>
          </div> */}
          <div className="flex items-center space-x-2"></div>
        </div>
        <Card className="w-full mx-auto p-6 rounded-lg shadow-xl bg-white dark:bg-zinc-900">
          <div className="flex items-center justify-between space-x-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Manajemen Akun
              </h2>
              <p className="text-muted-foreground">Data Manajemen</p>
            </div>
            <div className="flex items-center space-x-2"></div>
          </div>
          <DataTable data={dataManajemen} columns={columns} />
        </Card>
      </div>
    </>
  );
}
