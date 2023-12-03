"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
import { useSession } from "next-auth/react";

const skripsiSchema = z.object({
  status: z.string(),
  nilai: z.string(),
  semester: z.string(),
  tanggal_lulus: z.date({
    required_error: "tanggal sidang is required.",
  }),
  tanggal_sidang: z.date({
    required_error: "tanggal sidang is required.",
  }),
  lama_studi: z.string(),
  file: z.unknown(),
});

const SKRIPSIForm = () => {
  const { data: session } = useSession();
  const accessToken = session?.user?.access_token;
  const form = useForm<z.infer<typeof skripsiSchema>>({
    resolver: zodResolver(skripsiSchema),
    defaultValues: {
      file: "",
    },
  });
  const onSubmit = async (value: z.infer<typeof skripsiSchema>) => {
    try {
      if (!accessToken) {
        console.error("Access token not available");
        return;
      }
      // Di sini Anda dapat melakukan pengiriman data ke server atau melakukan tindakan lain sesuai kebutuhan aplikasi Anda.
      // Contoh pengiriman data menggunakan fetch API:
      const response = await fetch(
        "http://localhost:8080/mahasiswa/skripsi/submit",
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
          <h2 className="text-2xl font-bold tracking-tight">Skripsi</h2>
          <p className="text-muted-foreground">Isi Skripsi anda</p>
        </div>
        <Separator className="my-6" />
        <div className="mt-10 flex-grow mb-10">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Isi form Skripsi</CardTitle>
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
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status Mahasiswa</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  className="text-muted-foreground"
                                  placeholder="Status skripsi"
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="belum">Belum ambil</SelectItem>
                              <SelectItem value="sudah">
                                Sedang ambil
                              </SelectItem>
                              <SelectItem value="lulus">Lulus</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>Isi status anda</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="nilai"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nilai</FormLabel>
                          <FormControl>
                            <Input placeholder="Contoh: 1" {...field} />
                          </FormControl>
                          <FormDescription>Masukkan nilai PKL</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="semester"
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
                      name="tanggal_sidang"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Tanggal Sidang</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-[240px] pl-3 text-left font-normal w-full",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() ||
                                  date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tanggal_lulus"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Tanggal Lulus</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-[240px] pl-3 text-left font-normal w-full",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() ||
                                  date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lama_studi"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lama Studi</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Masukkan Lama Studi"
                              {...field}
                            />
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

export default SKRIPSIForm;
