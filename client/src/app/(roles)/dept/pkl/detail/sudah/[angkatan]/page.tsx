import { promises as fs } from "fs";
import path from "path";
import { Metadata } from "next";
import Image from "next/image";
import { z } from "zod";
import { PKLSchema } from "@/components/data/tabel/tabelPKL/schema";
import { DataTablePKL } from "@/components/table/PKL/data-table";
import { PKLColumns } from "@/components/table/PKL/columns";
import { Card } from "@/components/ui/card";

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
        <Card className="p-6 bg-white rounded-md shadow-md">
          <DataTablePKL data={dataPKL} columns={PKLColumns} />
        </Card>
      </div>
    </>
  );
}
