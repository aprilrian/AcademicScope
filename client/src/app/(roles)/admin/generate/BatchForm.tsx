"use client";

import { useForm } from "react-hook-form";
import { Form, FormDescription } from "@/components/ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";
import { toast } from "@/components/ui/use-toast";

const batchFormSchema = z.object({
  file: z.unknown(),
});
const BatchForm = () => {
  // Retrieve the accessToken from the session
  const { data: session } = useSession();
  const accessToken = session?.user?.access_token;

  const form = useForm<z.infer<typeof batchFormSchema>>({
    resolver: zodResolver(batchFormSchema),
    defaultValues: {
      file: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof batchFormSchema>) => {
    try {
      const formData = new FormData();
      formData.append("file", values.file as File);

      // Make sure accessToken is available
      if (!accessToken) {
        console.error("Access token not available");
        return;
      }

      // Make an API call using axios with Authorization header
      const response = await axios.post(
        "http://localhost:8080/operator/generateBatch",
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("API response:", response.data);
      form.reset();
      toast({
        title: "Generate Akun Batch",
        description: "Akun berhasil digenerate.",
        duration: 5000,
      });

      // Handle the response based on your application logic
      // For example, you might want to redirect the user or show a success message
    } catch (error) {
      // Handle errors, for example, log the error or show an error message
      console.error("Error submitting the form:", error);
      toast({
        title: "Error",
        description:
          // error?.response?.data?.message ||
          "There was an error generating the account.",
        duration: 5000,
      });
    }
  };

  // ... (rest of the component)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("file", file);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      // Make sure accessToken is available
      if (!accessToken) {
        console.error("Access token not available");
        return;
      }

      // Make an API call using axios to get the template file URL
      const response = await axios.get(
        "http://localhost:8080/operator/getBatchTemplate",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Get the template file URL from the API response
      const templateFileUrl = response.data.templateUrl;

      // Trigger download by setting window location to the template URL
      window.location.href = templateFileUrl;
    } catch (error) {
      // Handle errors, for example, log the error or show an error message
      console.error("Error downloading the template:", error);
    }
  };

  return (
    <div className="mt-5 flex-grow mb-5">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Generate akun mahasiswa dengan batch</CardTitle>
          <CardDescription>Isi menggunakan batch</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <Label htmlFor="file" className="col-span-2">
                    Generate akun secara Upload
                  </Label>
                  <Input
                    id="file"
                    type="file"
                    className="col-span-2"
                    onChange={handleFileChange}
                  />
                  <FormDescription className="col-span-2">
                    Upload file dengan format .csv atau .xsl
                  </FormDescription>
                  <Button onClick={handleDownloadTemplate}>
                    Download Template
                  </Button>
                </div>
              </div>
              <Button className="w-full mt-6" type="submit">
                Generate
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BatchForm;
