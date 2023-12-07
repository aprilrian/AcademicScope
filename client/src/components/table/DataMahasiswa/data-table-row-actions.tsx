"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";

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
import { mahasiswaSchema } from "../../data/tabel/tabelDataMahasiswa/schema";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const mahasiswa = mahasiswaSchema.parse(row.original);
  const router = useRouter(); // Initialize the useRouter hook
  const { data: session } = useSession();
  const role: string | undefined = session?.user?.role;

  const getRouteForRole = (role: string | undefined): string => {
    switch (role) {
      case "dosen":
        return "doswal";
      case "operator":
        return "admin";
      case "departemen":
        return "dept";
      // Add more cases as needed
      default:
        return ""; // Handle other cases or provide a default route
    }
  };

  const handleDetailClick = () => {
    const { nim } = mahasiswa;
    const route = getRouteForRole(role);
    router.push(`/${route}/datamahasiswa/${nim}`);
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
        <DropdownMenuItem onClick={handleDetailClick}>Detail</DropdownMenuItem>
        {/* Other menu items */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
