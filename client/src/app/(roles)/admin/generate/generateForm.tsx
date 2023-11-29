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
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

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
});

const GenerateForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const form = useForm<z.infer<typeof generateFormSchema>>({
    resolver: zodResolver(generateFormSchema),
    defaultValues: {
      nim: "",
      nama: "",
    },
  });

  const {
    handleSubmit, // tambahkan handleSubmit
    formState: { isValid },
  } = form;

  const onSubmit = async (values: z.infer<typeof generateFormSchema>) => {
    try {
      setLoading(true);

      // Make an API call using axios
      const response = await axios.post(
        "http://localhost:8080/user/generate",
        values
      );
      console.log("API response:", response.data);

      toast({
        title: "Generate Akun",
        description: "Akun berhasil digenerate.",
        duration: 5000,
      });
    } catch (error) {
      console.error("Error submitting the form:", error);

      // setError(
      //   error?.response?.data?.message ||
      //     "There was an error generating the account."
      // );

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

  const { toast } = useToast();

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
            <p>IsValid: {isValid ? 'true' : 'false'}</p>


            <Button className="w-full mt-6" type="submit" disabled={!isValid}>
              Generate
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default GenerateForm;
