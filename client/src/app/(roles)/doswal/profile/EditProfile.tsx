import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
import { toast, useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import React from "react";

const editProfileSchema = z.object({
  nama: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  alamat: z
    .string()
    .min(2, {
      message: "Address must be at least 2 characters.",
    })
    .max(50, {
      message: "Address must not be longer than 50 characters.",
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
  email: z.string({
    required_error: "Please select.",
  }),
  phone: z.string({
    required_error: "Please select.",
  }),
});

interface provinsi {
  label: string;
  value: string;
}

interface KabupatenKota {
  label: string;
  value: string;
}

const EditProfile = () => {
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
    },
  });

  const {
    handleSubmit,
    formState: { isValid },
  } = form;

  const onSubmit = async (values: z.infer<typeof editProfileSchema>) => {
    try {
      setLoading(true);

      // Make an API call using axios
      const response = await axios.post(
        "http://localhost:8080/mahasiswa/updateProfil",
        values
      );
      console.log("API response:", response.data);

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
          "There was an error generating the account.",
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
        const response = await axios.get("http://localhost:8080/api/provinsi");
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
        const response = await axios.get(
          "http://localhost:8080/api/kabupatenKota"
        );
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

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("file", file);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <Sheet>
          <SheetTrigger asChild>
            <Button>Edit Profile</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Edit profile</SheetTitle>
              <SheetDescription>
                Make changes to your profile here. Click save when you&apos;re done.
              </SheetDescription>
            </SheetHeader>

            <FormLabel>Foto Profil</FormLabel>
            <Input
              id="file"
              type="file"
              className="col-span-2"
              onChange={handleFileChange}
            />
            <FormDescription className="col-span-2">
              Upload foto anda dengan format .jpg atau .png
            </FormDescription>

            <FormField
              control={form.control}
              name="alamat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Jl. ..." {...field} />
                  </FormControl>
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
                  <Popover open={open} onOpenChange={setOpen}>
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
                                (provinsi) => provinsi.value === field.value
                              )?.label
                            : "Select Kode Provinsi"}
                          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search kode provinsi..." />
                        <CommandEmpty>No Kode Provinsi found.</CommandEmpty>
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
                            : "Select jalur Masuk"}
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
                                (jalurMasuk) => jalurMasuk.value === field.value
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
                                form.setValue("jalur_masuk", jalurMasuk.value);
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
                    This is the jalur Masuk that will be used in the dashboard.
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
                    <Input type="email" placeholder="..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>No. HP</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SheetFooter>
              <SheetClose asChild>
                <Button type="submit">Save changes</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </form>
    </Form>
  );
};

export default EditProfile;