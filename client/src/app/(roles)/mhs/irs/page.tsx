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
  const onSubmit = async (value: z.infer<typeof irsSchema>) => {
    try {
      if (!accessToken) {
        console.error("Access token not available");
        return;
      }
      // Di sini Anda dapat melakukan pengiriman data ke server atau melakukan tindakan lain sesuai kebutuhan aplikasi Anda.
      // Contoh pengiriman data menggunakan fetch API:
      const response = await fetch(
        "http://localhost:8080/mahasiswa/irs/submit",
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

        alert("IRS berhasil disubmit!");
      } else {
        
        alert("Gagal submit irs. Silakan coba lagi.");
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
              <CardTitle>Isi form IRS</CardTitle>
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
}

export default irsForm;
