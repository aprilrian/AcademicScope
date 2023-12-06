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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

const pklSchema = z.object({
  status: z.string(),
  nilai: z.string(),
  semester: z.string(),
  file: z.unknown(),
});

const PKLForm = () => {
  const { data: session } = useSession();
  const accessToken = session?.user?.access_token;
  const form = useForm<z.infer<typeof pklSchema>>({
    resolver: zodResolver(pklSchema),
    defaultValues: {
      file: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof pklSchema>) => {
    try {
      if (!accessToken) {
        console.error("Access token not available");
        return;
      }
      const formData = new FormData();
      formData.append("status", values.status);
      formData.append("semester", values.semester);
      formData.append("nilai", values.nilai);
      formData.append("file", values.file as File);

      formData.set("Content-Type", "multipart/form-data");

      const response = await axios.post(
        "http://localhost:8080/mahasiswa/pkl/submit",
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            // "Content-Type": "multipart/form-data",
          },
        }
      );
      form.reset();

      console.log("API response:", response.data);
      toast({
        title: "Submit PKL",
        description: "pkl berhasil di submit.",
        duration: 5000,
      });
    } catch (error) {
      console.error("Error submitting the form:", error);

      toast({
        title: "Error",
        description:
          // error?.response?.data?.message ||
          "Error submit PKL",
        duration: 5000,
      });
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("file", file);
    }
  };
  return (
    <>
      <div className="hidden space-y-6 p-10 pb-16 md:block  bg-gray-100">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">PKL</h2>
          <p className="text-muted-foreground">Isi PKL anda</p>
        </div>
        <Separator className="my-6" />
        <div className="mt-10 flex-grow mb-10">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Isi form PKL</CardTitle>
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
                                  placeholder="Status PKL"
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="belum ambil">
                                Belum ambil
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

                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="file">Upload Scan</Label>
                      <Input
                        id="file"
                        type="file"
                        onChange={handleFileChange}
                      />
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

export default PKLForm;
