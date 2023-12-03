"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
import axios from "axios";
import { useSession } from "next-auth/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const khsSchema = z.object({
  semester_aktif: z.string(),
  sks: z.string().min(2, {
    message: "Jumlah SKS must be at least 2 characters.",
  }),
  sks_kumulatif: z.string().min(2, {
    message: "Jumlah SKS must be at least 2 characters.",
  }),
  ip: z.string().min(2, {
    message: "Indeks Prestasi must be at least 2 characters.",
  }),
  ip_kumulatif: z.string().min(2, {
    message: "Indeks Prestasi must be at least 2 characters.",
  }),
  status_verifikasi: z.string(),
  file: z.unknown(),
});

const KHSForm = () => {
  const { data: session } = useSession();
  const accessToken = session?.user?.access_token;
  const form = useForm<z.infer<typeof khsSchema>>({
    resolver: zodResolver(khsSchema),
    defaultValues: {
      file: "",
    },
  });
  const onSubmit = async (value: z.infer<typeof khsSchema>) => {
    try {
      if (!accessToken) {
        console.error("Access token not available");
        return;
      }
      // Di sini Anda dapat melakukan pengiriman data ke server atau melakukan tindakan lain sesuai kebutuhan aplikasi Anda.
      // Contoh pengiriman data menggunakan fetch API:
      const response = await fetch(
        "http://localhost:8080/mahasiswa/khs/submit",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
          body: JSON.stringify(value),
        }
      );

      if (response.ok) {
        alert("KHS berhasil disubmit!");
      } else {
        alert("Gagal submit khs. Silakan coba lagi.");
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  };

  return (
    <>
      <div className="hidden space-y-6 p-10 pb-16 md:block  bg-gray-100">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">IRS</h2>
          <p className="text-muted-foreground">Isi IRS anda</p>
        </div>
        <Separator className="my-6" />
        <div className="mt-10 flex-grow mb-10">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Isi form KHS</CardTitle>
              <CardDescription>Isi dengan benar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                  >
                    <FormField
                      control={form.control}
                      name="semester_aktif"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Semester</FormLabel>
                          <FormControl>
                            <Input placeholder="Contoh: 1" {...field} />
                          </FormControl>
                          <FormDescription>
                            Masukkan sesuai semester
                          </FormDescription>
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
                            <Input placeholder="Contoh: 24" {...field} />
                          </FormControl>
                          <FormDescription>
                            Masukkan jumlah sks anda
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="sks_kumulatif"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Jumlah SKS Kumulatif</FormLabel>
                          <FormControl>
                            <Input placeholder="Contoh: 24" {...field} />
                          </FormControl>
                          <FormDescription>
                            Masukkan jumlah sks anda
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="ip"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Indeks Prestasi</FormLabel>
                          <FormControl>
                            <Input placeholder="Contoh: 2.1, 4.0" {...field} />
                          </FormControl>
                          <FormDescription>
                            Masukkan Indeks Prestasi anda
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="ip_kumulatif"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Indeks Prestasi Kumulatif</FormLabel>
                          <FormControl>
                            <Input placeholder="Contoh: 2.1, 4.0" {...field} />
                          </FormControl>
                          <FormDescription>
                            Masukkan Indeks Prestasi Kumulatif anda
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="status_verifikasi"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih status anda" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="belum">
                                belum
                              </SelectItem>
                              <SelectItem value="sedang diverifikasi">
                                sedang diverifikasi
                              </SelectItem>
                              <SelectItem value="sudah">
                                sudah
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Pilih status anda
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="scan">Upload Scan</Label>
                      <Input id="scan" type="file" />
                      <FormDescription>Masukkan file PDF</FormDescription>
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

export default KHSForm;
