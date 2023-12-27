"use client";

import { useRouter } from "next/navigation";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { ButtonIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
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
import { verifikasiSchema } from "../../data/tabel/tabelIRS/schema";
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
  const router = useRouter();

  const handleDelete = async () => {
    try {
      const { nim, semester } = verifikasi;
      await axios.delete(
        `http://localhost:8080/dosen/irs/delete/${nim}/${semester}`,
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
      const { nim, semester } = verifikasi;
      await axios.put(
        `http://localhost:8080/dosen/irs/verify/${nim}/${semester}`,
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

  const handleEditIRS = async () => {
    try {
      const { nim, semester } = verifikasi;
      await axios.put(
        `http://localhost:8080/dosen/irs/edit/${nim}/${semester}`,
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

  const getFileUrl = async () => {
    try {
      const { nim, semester } = verifikasi;
      const response = await axios.get(
        `http://localhost:8080/dosen/irs/show/${nim}/${semester}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const trimmedUrl = response.data.trim(); // Trim leading and trailing whitespace

      console.log(trimmedUrl);
      return trimmedUrl;
    } catch (error) {
      console.error(
        "Error getting IRS path:",
        (error as any).response || (error as any).message || error
      );
      // Handle errors or show a notification to the user
      throw error; // Rethrow the error if you want to propagate it
    }
  };

  const handleDownloadIRS = async () => {
    try {
      const fileURL = await getFileUrl();
      console.log(fileURL);
      const fullFileUrl = `http://localhost:8080/${fileURL}`;
      const filename = fileURL.substring(fileURL.lastIndexOf("/") + 1);

      const response = await axios.get(fullFileUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        responseType: "arraybuffer", // Set the response type to arraybuffer
      });

      // Create a Blob from the array buffer
      const blob = new Blob([response.data], { type: "application/pdf" }); // Set content type to application/pdf

      // Create a download link
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = filename; // Use the extracted filename
      document.body.appendChild(link);

      // Trigger the download
      link.click();

      // Remove the link from the DOM
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading IRS file:", error);
      // Handle errors or show a notification to the user
    }
  };

  const handleShowIRS = async () => {
    try {
      const fileURL = await getFileUrl();
      const fullFileUrl = `http://localhost:8080/${fileURL}`;
      window.open(fullFileUrl, "_blank");
    } catch (error) {
      // Handle errors here if needed
      console.error("Error handling IRS file:", error);
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
        <DropdownMenuItem onClick={handleShowIRS}>Detail</DropdownMenuItem>

        <DropdownMenuItem onClick={handleDownloadIRS}>
          Download
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleVerifyIRS}>Terima</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete}>
          Hapus
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
