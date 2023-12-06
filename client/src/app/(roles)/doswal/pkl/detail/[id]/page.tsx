import { promises as fs } from "fs";
import path from "path";
import { Metadata } from "next";
import Image from "next/image";
import { z } from "zod";

import { columns } from "@/components/table/PKL/columns";
import { DataTable } from "@/components/table/PKL/data-table";
import { PKLSchema } from "@/components/data/tabel/tabelPKL/schema";

export const metadata: Metadata = {
  title: "Detail PKL",
  description: "List detail PKL",
};

async function getDataPKL() {
  const data = await fs.readFile(
    path.join(process.cwd(), "src/components/data/tabel/tabelPKL/dataPKL.json")
  );

  const dataPKL = JSON.parse(data.toString());

  return z.array(PKLSchema).parse(dataPKL);
}

export default async function pklPage() {
  const dataPKL = await getDataPKL();

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
        <DataTable data={dataPKL} columns={columns} />
      </div>
    </>
  );
}
