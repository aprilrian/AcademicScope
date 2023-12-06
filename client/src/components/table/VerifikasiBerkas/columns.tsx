"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Angkatan, Semester } from "../../data/tabel/tabelVerifikasi/data";
import { dataVerifikasi } from "../../data/tabel/tabelVerifikasi/schema";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

export const columns: ColumnDef<dataVerifikasi>[] = [
  {
    accessorKey: "mahasiswa_nim",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="NIM" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("mahasiswa_nim")}</div>,
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
    accessorKey: "semester_aktif",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Semester" />
    ),
    cell: ({ row }) => {
      const semester = Semester.find(
        (semester) => semester.value === row.getValue("semester_aktif")
      );

      if (!semester) {
        return null;
      }

      return (
        <div className="flex w-[100px] items-center">
          <span>{semester.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
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
    accessorKey: "sks",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="SKS" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("sks")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
