"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { Separator } from "@/components/ui/separator";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";
import axios from "axios";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import React from "react";
import { useSession } from "next-auth/react";

const editProfileSchema = z.object({
  nama: z.string().min(2, {
    message: "Nama must be at least 2 characters.",
  }),
  alamat: z
    .string()
    .min(2, {
      message: "Alamat must be at least 2 characters.",
    })
    .max(50, {
      message: "Alamat must not be longer than 50 characters.",
    }),
  kode_kabupatenKota: z.string({
    required_error: "Please select.",
  }),
  kode_provinsi: z.string({
    required_error: "Please select.",
  }),
  jalur_masuk: z.string({
    required_error: "Please select.",
  }),
  email: z
    .string({
      required_error: "Please select an email to display.",
    })
    .email(),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  phone: z.string().min(10, {
    message: "No. Telephone must be at least 10 characters.",
  }),
  file: z.unknown(),
});

type EditProfileFormValues = z.infer<typeof editProfileSchema>;

export default function EditProfileForm() {
  const { data: session } = useSession();
  const accessToken = session?.user?.access_token;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<z.infer<typeof editProfileSchema>>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      nama: "",
      alamat: "",
      kode_kabupatenKota: "",
      kode_provinsi: "",
      jalur_masuk: "",
      email: "",
      phone: "",
      file: "",
    },
  });

  const {
    handleSubmit,
    formState: { isValid },
  } = form;

  const onSubmit = async (values: z.infer<typeof editProfileSchema>) => {
    try {
      setLoading(true);

      if (!accessToken) {
        console.error("Access token not available");
        return;
      }

      const formData = new FormData();
      formData.append("nama", values.nama);
      formData.append("alamat", values.alamat);
      formData.append("kode_kabupatenKota", values.kode_kabupatenKota);
      formData.append("kode_provinsi", values.kode_provinsi);
      formData.append("jalur_masuk", values.jalur_masuk);
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("phone", values.phone);
      formData.append("file", values.file as File);

      formData.set("Content-Type", "multipart/form-data");

      const response = await axios.post(
        "http://localhost:8080/mahasiswa/updateProfile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            // "Content-Type": "multipart/form-data",
          },
        }
      );
      form.reset();

      toast({
        title: "Edit akun",
        description: "Akun berhasil diedit.",
        duration: 5000,
      });
    } catch (error) {
      console.error("Error submitting the form:", error);

      toast({
        title: "Error",
        description:
          // error?.response?.data?.message ||
          "There was an error editing the account.",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  // State to store the fetched provinsi data
  const [provinsi, setProvinsi] = React.useState([]);

  // State to store the fetched kabupatenKota data
  const [kabupatenKota, setKabupatenKota] = React.useState([]);

  // Fetch provinsi data
  React.useEffect(() => {
    const fetchProvinsi = async () => {
      try {
        const response = await axios.get("http://localhost:8080/provinsi");
        setProvinsi(response.data);
      } catch (error) {
        console.error("Error fetching provinsi data:", error);
      }
    };

    fetchProvinsi();
  }, []);

  // Fetch kabupatenKota data
  React.useEffect(() => {
    const fetchKabupatenKota = async () => {
      try {
        const response = await axios.get("http://localhost:8080/kabupatenKota");
        setKabupatenKota(response.data);
      } catch (error) {
        console.error("Error fetching kabupatenKota data:", error);
      }
    };

    fetchKabupatenKota();
  }, []);

  const jalurMasuk = [
    { label: "SNMPTN", value: "snmptn" },
    { label: "SBMPTN", value: "sbmptn" },
    { label: "Mandiri", value: "mandiri" },
    { label: "Lainnya", value: "lainnya" },
  ] as const;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("file", file);
    }
  };
  return (
    <div className="hidden space-y-6 p-10 pb-16 md:block">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Update Profil</h2>
        <p className="text-muted-foreground">
          Pengguna diharapkan untuk melakukan pembaruan profil saat pertama kali
          masuk.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="mt-10 flex-grow mb-10">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Update Profil Anda</CardTitle>
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
                    name="nama"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Lengkap</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormDescription>
                          Please provide your name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="alamat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alamat</FormLabel>
                        <FormControl>
                          <Input placeholder="Your address" {...field} />
                        </FormControl>
                        <FormDescription>
                          Please provide your current address.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="kode_provinsi"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Kode Provinsi</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-[200px] justify-between",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? provinsi.find(
                                      (provinsi) =>
                                        provinsi.value === field.value
                                    )?.label
                                  : "Select Kode Provinsi"}
                                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-0">
                            <Command>
                              <CommandInput placeholder="Search kode provinsi..." />
                              <CommandEmpty>
                                No Kode Provinsi found.
                              </CommandEmpty>
                              <CommandGroup>
                                {provinsi.map((kodeProvinsi) => (
                                  <CommandItem
                                    value={kodeProvinsi.label}
                                    key={kodeProvinsi.value}
                                    onSelect={() => {
                                      form.setValue(
                                        "kode_provinsi",
                                        kodeProvinsi.value
                                      );
                                      setOpen(false);
                                    }}
                                  >
                                    <CheckIcon
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        kodeProvinsi.value === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {kodeProvinsi.label}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          Pilih kode provinsi anda
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="kode_kabupatenKota"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Kode Kabupaten</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-[200px] justify-between",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? kabupatenKota.find(
                                      (kabupatenKota) =>
                                        kabupatenKota.value === field.value
                                    )?.label
                                  : "Select Kode Kabupaten"}
                                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-0">
                            <Command>
                              <CommandInput placeholder="Search kabupaten/Kota..." />
                              <CommandEmpty>No jalur Masuk found.</CommandEmpty>
                              <CommandGroup>
                                {kabupatenKota.map((kodeKabupatenKota) => (
                                  <CommandItem
                                    value={kodeKabupatenKota.label}
                                    key={kodeKabupatenKota.value}
                                    onSelect={() => {
                                      form.setValue(
                                        "kode_kabupatenKota",
                                        kodeKabupatenKota.value
                                      );
                                    }}
                                  >
                                    <CheckIcon
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        kodeKabupatenKota.value === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {kodeKabupatenKota.label}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          Pilih kode kabupaten anda
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="jalur_masuk"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Jalur Masuk</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-[200px] justify-between",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? jalurMasuk.find(
                                      (jalurMasuk) =>
                                        jalurMasuk.value === field.value
                                    )?.label
                                  : "Select jalur Masuk"}
                                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-0">
                            <Command>
                              <CommandInput placeholder="Search jalur Masuk..." />
                              <CommandEmpty>No jalur Masuk found.</CommandEmpty>
                              <CommandGroup>
                                {jalurMasuk.map((jalurMasuk) => (
                                  <CommandItem
                                    value={jalurMasuk.label}
                                    key={jalurMasuk.value}
                                    onSelect={() => {
                                      form.setValue(
                                        "jalur_masuk",
                                        jalurMasuk.value
                                      );
                                    }}
                                  >
                                    <CheckIcon
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        jalurMasuk.value === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {jalurMasuk.label}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          Pilih jalur masuk anda
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Email" {...field} />
                        </FormControl>
                        <FormDescription>
                          Please provide a valid Email address.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password Baru*</FormLabel>
                        <FormControl>
                          <Input
                            id="password"
                            type="password"
                            placeholder="Your password"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Provide your new password.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>No. Telephone</FormLabel>
                        <FormControl>
                          <Input placeholder="123-456-7890" {...field} />
                        </FormControl>
                        <FormDescription>
                          Please provide a valid phone number.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="file">Foto Profil</Label>
                    <Input id="file" type="file" onChange={handleFileChange} />
                    <FormDescription>Masukkan foto profil anda</FormDescription>
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
  );
}
