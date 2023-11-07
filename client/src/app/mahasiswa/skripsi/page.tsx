"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Label } from "@/components/ui/label";
import React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

const loginSchema = yup
  .object()
  .shape({
    status: yup.string().required(),
    skripsi: yup.string().required(),
    scan: yup.string().required(),
    tglSidang: yup.string().required(),
    lamaStudi: yup.string().required(),
  })
  .required();

export function ProfileForm() {
  const form = useForm({ resolver: yupResolver(loginSchema) });
  const [position, setPosition] = React.useState("bottom");
  const [date, setDate] = React.useState<Date>();

  const onSubmit = async (value: any) => {
    try {
      // Di sini Anda dapat melakukan pengiriman data ke server atau melakukan tindakan lain sesuai kebutuhan aplikasi Anda.
      // Contoh pengiriman data menggunakan fetch API:
      const response = await fetch("/api/submit-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
      });

      if (response.ok) {
        // Handle sukses, misalnya menavigasi ke halaman lain atau menampilkan pesan sukses.
        alert("Profil berhasil disubmit!");
      } else {
        // Handle kesalahan, misalnya menampilkan pesan kesalahan.
        alert("Gagal menambahkan profil. Silakan coba lagi.");
      }
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      // Handle kesalahan lain jika ada.
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='className="w-full max-w-screen-xl p-8 bg-white rounded-lg shadow-lg" space-y-4'
          >
            <FormLabel>Status</FormLabel>
            <br />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Pilih Status</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Status Mahasiswa</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={position}
                  onValueChange={setPosition}
                >
                  <DropdownMenuRadioItem value="top">
                    Aktif
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="bottom">
                    Lulus
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="right">
                    Dropout
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <FormField
              control={form.control}
              name="skripsi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nilai Skripsi</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan Nilai Skripsi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormLabel>Tanggal Sidang</FormLabel>
            <br />

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? (
                    format(date, "PPP")
                  ) : (
                    <span>Pilih Tanggal Sidang</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <FormField
              control={form.control}
              name="lamaStudi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lama Studi</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan Lama Studi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="scan">Upload Scan</Label>
              <Input id="scan" type="file" />
            </div>

            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </>
  );
}

export default ProfileForm;
