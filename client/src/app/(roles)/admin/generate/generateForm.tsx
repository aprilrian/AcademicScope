"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import {
  CommandInput,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "cmdk";
import { cn } from "@/lib/utils";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { useSession } from "next-auth/react";
import React from "react";

const generateFormSchema = z.object({
  nim: z
    .string()
    .min(14, {
      message: "NIM must be at least 14 characters.",
    })
    .max(14, {
      message: "Name must not be longer than 14 characters.",
    }),
  nama: z
    .string()
    .min(2, {
      message: "Nama must be at least 2 characters.",
    })
    .max(50, {
      message: "Nama must not be longer than 50 characters.",
    }),
  angkatan: z.string({
    required_error: "Please select.",
  }),
  nip_dosen: z.string({
    required_error: "Please select.",
  }),
});

const GenerateForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = React.useState(false);
  const [dosen, setDosen] = React.useState<any>([]);

  const { toast } = useToast();


  const form = useForm<z.infer<typeof generateFormSchema>>({
    resolver: zodResolver(generateFormSchema),
    defaultValues: {
      nim: "",
      nama: "",
    },
  });

  const { data: session } = useSession();
  const accessToken = session?.user?.access_token;

  const {
    handleSubmit,
    formState: { isValid },
  } = form;

  const onSubmit = async (values: z.infer<typeof generateFormSchema>) => {
    try {
      setLoading(true);

      if (!accessToken) {
        console.error("Access token not available");
        return;
      }

      const response = await axios.post(
        "http://localhost:8080/operator/generate",values,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("API response:", response.data);

      toast({
        title: "Generate Akun",
        description: "Akun berhasil digenerate.",
        duration: 5000,
      });
    } catch (error) {
      console.error("Error submitting the form:", error);

      toast({
        title: "Error",
        description:
          // error?.response?.data?.message ||
          "There was an error generating the account.",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const angkatan = [
    { label: "2016", value: "2016" },
    { label: "2017", value: "2017" },
    { label: "2018", value: "2018" },
    { label: "2019", value: "2019" },
    { label: "2020", value: "2020" },
    { label: "2021", value: "2021" },
    { label: "2022", value: "2022" },
    { label: "2023", value: "2023" },
  ] as const;

  React.useEffect(() => {
    const fetchDosen = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/master/getAllDosen",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setDosen(response.data);
      } catch (error) {
        console.error("Error fetching data dosen:", error);
      }
    };

    fetchDosen();
  }, []);

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Generate akun mahasiswa</CardTitle>
        <CardDescription>Isi dengan benar</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="nim"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NIM</FormLabel>
                    <FormControl>
                      <Input placeholder="2406012..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nama"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Lengkap</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="John Doe..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nip_dosen"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Dosen Wali</FormLabel>
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
                              ? dosen.find(
                                  (dosen:any) => dosen.value === field.value
                                )?.label
                              : "Pilih dosen"}
                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput placeholder="Pilih dosen..." />
                          <CommandEmpty>No dosen found.</CommandEmpty>
                          <CommandGroup>
                            {dosen.map((dosenItem : any) => (
                              <CommandItem
                                value={dosenItem.label}
                                key={dosenItem.value}
                                onSelect={() => {
                                  form.setValue("nip_dosen", dosenItem.value);
                                }}
                              >
                                <CheckIcon
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    dosenItem.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {dosenItem.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>Pilih Dosen Wali anda</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="angkatan"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Angkatan</FormLabel>
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
                              ? angkatan.find(
                                  (angkatan) => angkatan.value === field.value
                                )?.label
                              : "Pilih angkatan"}
                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput placeholder="Pilih angkatan..." />
                          <CommandEmpty>No angkatan found.</CommandEmpty>
                          <CommandGroup>
                            {angkatan.map((angkatanItem) => (
                              <CommandItem
                                value={angkatanItem.label}
                                key={angkatanItem.value}
                                onSelect={() => {
                                  form.setValue("angkatan", angkatanItem.value);
                                }}
                              >
                                <CheckIcon
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    angkatanItem.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {angkatanItem.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>Pilih angkatan anda</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>


            <Button className="w-full mt-6" type="submit">
              Generate
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default GenerateForm;
