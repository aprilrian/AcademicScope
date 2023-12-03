import { promises as fs } from "fs";
import path from "path";
import { Metadata } from "next";
import Image from "next/image";
import { z } from "zod";

import { columns } from "@/components/table/DataMahasiswa/columns";
import { DataTable } from "@/components/table/DataMahasiswa/data-table";
import { mahasiswaSchema } from "@/components/data/tabelDataMahasiswa/schema";

export const metadata: Metadata = {
  title: "Tasks",
  description: "A task and issue tracker build using Tanstack Table.",
};

async function getTasks() {
  const data = await fs.readFile(
    path.join(
      process.cwd(),
      "src/components/data/tabelDataMahasiswa/dataMahasiswa.json"
    )
  );

  const dataMahasiswa = JSON.parse(data.toString());

  return z.array(mahasiswaSchema).parse(dataMahasiswa);
}

export default async function TaskPage() {
  const dataMahasiswa = await getTasks();

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
