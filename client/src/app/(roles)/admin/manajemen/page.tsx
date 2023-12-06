import { promises as fs } from "fs";
import path from "path";
import { Metadata } from "next";
import Image from "next/image";
import { z } from "zod";

import { columns } from "@/components/table/ManajemenAkun/columns";
import { DataTable } from "@/components/table/ManajemenAkun/data-table";
import { manajemenSchema } from "@/components/data/tabel/tabelManajemenAkun/schema";

export const metadata: Metadata = {
  title: "Manajemen Akun",
  description: "Manajemen Akun",
};

export default async function manajemenPage( ) {
  const dataManajemen = await getDataManajemen();
  
  async function getDataManajemen() {
    const data = await fs.readFile(
      path.join(
        process.cwd(),
        "src/components/data/tabel/tabelManajemenAkun/dataManajemen.json"
      )
    );

    const dataManajemen = JSON.parse(data.toString());

    return z.array(manajemenSchema).parse(dataManajemen);
  }
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
            <h2 className="text-2xl font-bold tracking-tight">Data Skripsi</h2>
            <p className="text-muted-foreground">Data Skripsi</p>
          </div>
          <div className="flex items-center space-x-2"></div>
        </div>
        <DataTable data={dataManajemen} columns={columns} />
      </div>
    </>
  );
}
