"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Angkatan } from "../../data/tabel/tabelPKL/data";
import { dataPKL } from "../../data/tabel/tabelPKL/schema";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

export const columns: ColumnDef<dataPKL>[] = [
  {
    accessorKey: "nim",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="NIM" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("nim")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "nama",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mahasiswa" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("nama")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "nilai",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nilai" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("nilai")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
    // cell: ({ row }) => {
    //   const nilai = nilai.find(
    //     (nilai) => nilai.value === row.getValue("nilai")
    //   );

      // if (!nilai) {
      //   return null;
      // }

  //     return (
  //       <div className="flex w-[100px] items-center">
  //         {/* <span>{nilai.label}</span> */}
  //       </div>
  //     );
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id));
  //   },
  // },
  {
    accessorKey: "angkatan",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Angkatan" />
    ),
    cell: ({ row }) => {
      const angkatan = Angkatan.find(
        (angkatan) => angkatan.value === row.getValue("angkatan")
      );

      if (!angkatan) {
        return null;
      }

      return (
        <div className="flex items-center">
          <span>{angkatan.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
