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
import { useSession } from "next-auth/react";
import { toast } from "@/components/ui/use-toast";
import axios from "axios";

const irsSchema = z.object({
  semester_aktif: z.string(),
  sks: z.string().min(2, {
    message: "Jumlah SKS must be at least 2 characters.",
  }),
  file: z.unknown(),
});

export function irsForm() {
  const { data: session } = useSession();
  const accessToken = session?.user?.access_token;
  const form = useForm<z.infer<typeof irsSchema>>({
    resolver: zodResolver(irsSchema),
    defaultValues: {
      file: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof irsSchema>) => {
    try {
      if (!accessToken) {
        console.error("Access token not available");
        return;
      }
      const formData = new FormData();
      formData.append("semester_aktif", values.semester_aktif);
      formData.append("sks", values.sks);
      formData.append("file", values.file as File);

      formData.set("Content-Type", "multipart/form-data");

      const response = await axios.post(
        "http://localhost:8080/mahasiswa/irs/submit",
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
        title: "Submit IRS",
        description: "IRS berhasil di submit.",
        duration: 5000,
      });
    } catch (error) {
      console.error("Error submitting the form:", error);

      toast({
        title: "Error",
        description:
          // error?.response?.data?.message ||
          "There was an error submitting IRS.",
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
      <div className="hidden space-y-6 p-10 pb-16 md:block  bg-gray-100 dark:bg-gray-800">
        {/* <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">IRS</h2>
          <p className="text-muted-foreground">Isi IRS anda</p>
        </div>
        <Separator className="my-6" /> */}
        <div className="mt-10 flex-grow mb-10">
        <Card className="w-11/12 p-6 rounded-lg shadow-xl">
        <CardHeader className="pb-3 flex flex-col items-center">
              <CardTitle>Form Submit IRS</CardTitle>
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
                            Masukkan jumlah SKS anda
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
}

export default irsForm;
