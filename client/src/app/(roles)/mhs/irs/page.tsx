"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
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
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";

const profileFormSchema = z.object({
  smt: z.string().min(2, {
    message: "Semester must be at least 2 characters.",
  }),
  sks: z.string().min(2, {
    message: "Jumlah SKS must be at least 2 characters.",
  }),
  scan: z.string().refine(
    (value) => {
      if (!value) {
        return false;
      }
      const fileExtension = value.split(".").pop();
      return (
        typeof fileExtension === "string" &&
        fileExtension.toLowerCase() === "pdf"
      );
    },
    {
      message: "Scan file must be in PDF format.",
    }
  ),
});

const loginSchema = yup
  .object()
  .shape({
    semester_aktif: yup.string().required(),
    sks: yup.string().required(),
    sks_kumulatif: yup.string().required(),
    ip: yup.string().required(),
    ip_kumulatif: yup.string().required(),
    file: yup.string().required(),
    mahasiswa_id: yup.string().required(),
  })
  .required();

export function ProfileForm() {
  const form = useForm({ resolver: yupResolver(loginSchema) });

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
      <div className="hidden space-y-6 p-10 pb-16 md:block">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">IRS</h2>
          <p className="text-muted-foreground">Isi IRS anda</p>
        </div>
        <Separator className="my-6" />
        <div className="mt-10 flex-grow mb-10">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Isi form IRS</CardTitle>
              <CardDescription>Isi dengan benar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="semester_aktif"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pilih Semester</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan semester" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jumlah SKS</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan SKS" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="scan">Upload Scan</Label>
              <Input id="scan" type="file" />
            </div>

            <CardFooter>
                      <Button type="submit" className="w-full">
                        Submit
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default ProfileForm;
