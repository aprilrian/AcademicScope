"use client";

import { Worker, Viewer } from "@react-pdf-viewer/core";
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

  const handleShowIRS = async () => {
    try {
      const { nim, semester } = verifikasi;
      const response = await axios.get(
        `http://localhost:8080/dosen/irs/show/${nim}/${semester}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          responseType: "blob", // Set the responseType to 'blob' to handle various file types
        }
      );

      const contentType = response.headers["content-type"];

      // Handle different file types
      if (contentType.includes("application/pdf")) {
        // Display PDF using a PDF viewer or download link
        const pdfUrl = URL.createObjectURL(new Blob([response.data]));
        window.open(pdfUrl, "_blank");
      } else if (contentType.includes("image")) {
        // Display image using an image element
        const imageUrl = URL.createObjectURL(new Blob([response.data]));
        window.open(imageUrl, "_blank");
      } else {
        // Handle other file types or show a download link
        const fileUrl = URL.createObjectURL(new Blob([response.data]));
        const downloadLink = document.createElement("a");
        downloadLink.href = fileUrl;
        downloadLink.download = `file.${contentType.split("/")[1]}`;
        downloadLink.click();
      }
    } catch (error) {
      console.error("Error fetching IRS detail:", error);
      // Handle errors or show a notification to the user
    }
  };

  // const handleShowIRS = async () => {
  //   try {
  //     const { nim, semester } = verifikasi; // Assuming verifikasi is properly defined somewhere in your code
  //     const response = await axios.get<Blob>(
  //       `https://localhost:8080/dosen/irs/show/${nim}/${semester}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //         responseType: "blob",
  //       }
  //     );

  //     const contentType = response.headers["content-type"];

  //     // Handle different file types
  //     if (contentType.includes("application/pdf")) {
  //       // Display PDF using the react-pdf library
  //       const pdfUrl = URL.createObjectURL(new Blob([response.data]));

  //       // Render PDF preview
  //       const pdfViewer = (
  //         <>
  //           <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
  //             {/* You should replace Viewer with the actual component you are using */}
  //             {/* e.g., <YourPdfViewerComponent fileUrl={pdfUrl} /> */}
  //             <Viewer fileUrl={pdfUrl} />
  //           </Worker>
  //         </>
  //       );

  //       // Open a modal or use a UI component to display the preview
  //       console.log("Displaying PDF preview:", pdfViewer);
  //     } else if (contentType.includes("image")) {
  //       // Display image using an image element
  //       const imageUrl = URL.createObjectURL(new Blob([response.data]));

  //       // Render image preview
  //       const imageViewer = <img src={imageUrl} alt="Preview" />;

  //       // Open a modal or use a UI component to display the preview
  //       console.log("Displaying image preview:", imageViewer);
  //     } else {
  //       // Handle other file types or show a download link
  //       const fileUrl = URL.createObjectURL(new Blob([response.data]));
  //       const downloadLink = document.createElement("a");
  //       downloadLink.href = fileUrl;
  //       downloadLink.download = `file.${contentType.split("/")[1]}`;
  //       downloadLink.click();
  //     }
  //   } catch (error) {
  //     console.error("Error fetching IRS detail:", error);
  //     // Handle errors or show a notification to the user
  //     // You might want to notify the user about the error, for example using a notification library
  //   }
  // };

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
