"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Role } from "../../data/tabel/tabelManajemenAkun/data";
import { dataManajemen } from "../../data/tabel/tabelManajemenAkun/schema";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

export const columns: ColumnDef<dataManajemen>[] = [
  {
    accessorKey: "username",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Username" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("username")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("email")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  // {
  //   accessorKey: "nama",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Mahasiswa" />
  //   ),
  //   cell: ({ row }) => {
  //     return (
  //       <div className="flex space-x-2">
  //         <span className="max-w-[500px] truncate font-medium">
  //           {row.getValue("nama")}
  //         </span>
  //       </div>
  //     );
  //   },
  // },

  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      const role = Role.find(
        (role) => role.value === row.getValue("role")
      );

      if (!role) {
        return null;
      }

      return (
        <div className="flex items-center">
          <span>{role.label}</span>
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
