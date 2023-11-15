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
import axios from "axios";

// const formSchema = z.object({
//   username: z.string().min(2, {
//     message: "Username must be at least 2 characters.",
//   }),
// });

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

const KHSForm = () => {
  const form = useForm({ resolver: yupResolver(loginSchema) });

  async function onSubmit(values: any) {
    try {
      const res = await axios.post("http://localhost:3000/khs", values);

      if (res.status === 200) {
        alert("KHS berhasil disubmit!");
      } else {
        alert("Gagal menambahkan KHS. Silakan coba lagi.");
      }
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      // Handle other errors if needed.
    }
  }

  return (
    <>
      <div className="hidden space-y-6 p-10 pb-16 md:block">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">KHS</h2>
          <p className="text-muted-foreground">Isi KHS</p>
        </div>
        <Separator className="my-6" />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="semester_aktif"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="semester_aktif">Pilih Semester</FormLabel>
                  <FormControl>
                    <Input id='semester_aktif' type='semester_aktif'placeholder="Masukkan semester" {...field} />
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
                    <Input placeholder="Masukkan Jumlah SKS" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sks_kumulatif"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SKS Kumulatif</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan SKS Kumulatif" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IP Semester</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan IP Semester" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ip_kumulatif"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IP Kumulatif</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan IPK" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="file">Upload Scan</Label>
              <Input className='w-full' id="file" type="file" />
            </div>

            <Button type="submit" className='w-full'>Submit</Button>
          </form>
        </Form>
      </div>
    </>
  );
};

export default KHSForm;
