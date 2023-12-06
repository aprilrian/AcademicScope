"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// import { labels } from "../data/data"
import { verifikasiSchema } from "../../data/tabel/tabelVerifikasi/schema";
import axios from "axios";
import { useSession } from "next-auth/react";
import { toast } from "@/components/ui/use-toast";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const verifikasi = verifikasiSchema.parse(row.original);
  const { data: session } = useSession();
  const accessToken = session?.user?.access_token;

  const handleDelete = async () => {
    try {
      const { mahasiswa_nim, semester_aktif } = verifikasi;
      await axios.delete(
        `http://localhost:8080/dosen/irs/delete/${mahasiswa_nim}/${semester_aktif}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      window.location.reload();

      // Show toast notification
      setTimeout(() => {
        toast({
          title: "Delete IRS",
          description: "IRS berhasil dihapus.",
          duration: 5000,
        });
      }, 1000);

      // Refresh the page
    } catch (error) {
      console.error(
        "Error deleting item:",
        (error as any).response || (error as any).message || error
      );
      // Handle errors or show a notification to the user
    }
  };

  const handleVerifyIRS = async () => {
    try {
      const { mahasiswa_nim, semester_aktif } = verifikasi;
      await axios.put(
        `http://localhost:8080/dosen/irs/verifyIRS/${mahasiswa_nim}/${semester_aktif}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Show toast notification
      window.location.reload();

      setTimeout(() => {
        toast({
          title: "Verify IRS",
          description: "IRS berhasil di verify.",
          duration: 5000,
        });
      }, 1000);

      // Refresh the page
    } catch (error) {
      console.error(
        "Error verifying IRS:",
        (error as any).response || (error as any).message || error
      );
      // Handle errors or show a notification to the user
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem>View IRS Detail</DropdownMenuItem>
        <DropdownMenuItem onClick={handleVerifyIRS}>
          Verify IRS
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Edit</DropdownMenuItem>

        <DropdownMenuItem onClick={handleDelete}>
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
