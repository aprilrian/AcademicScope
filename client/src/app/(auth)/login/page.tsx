"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { IconArrowLeft } from "@tabler/icons-react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useRouter } from "next-nprogress-bar";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useSession } from "next-auth/react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const loginSchema = yup
  .object()
  .shape({
    email: yup.string().required(),
    password: yup.string().required(),
  })
  .required();

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const { data: session } = useSession();

  const form = useForm({ resolver: yupResolver(loginSchema) });
  const {
    formState: { isValid },
  } = form;

  async function onSubmit(values: any) {
    try {
      setLoading(true);

      const res = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (!res?.error) {
        const userRole = session?.user?.role;
        // const userRole = res?.user?.role; // Assuming the user's role is provided in the response

        switch (userRole) {
          case "operator":
            router.push("/admin/dashboard");
            break;
          case "mahasiswa":
            router.push("/mhs/dashboard");
            break;
          case "dosenwali":
            router.push("/doswal/dashboard");
            break;
          case "departemen":
            router.push("/dept/dashboard");
            break;
          default:
            router.push("/dashboard"); // Redirect to a default dashboard if the role is not recognized
            break;
        }
      } else {
        setError(res?.error);
        form.setError("email", { message: res?.error });
        form.setError("password", { message: res?.error });
      }
    } catch (error: any) {
      if (error) setError(error?.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center flex-col min-h-screen">
      <Card className="w-full max-w-xs shadow-none">
        <CardHeader className="pb-3">
          <img src="/public/logo.png" alt="" />
          <CardTitle className="flex item-center">AcademicScope</CardTitle>
          <CardDescription>Log In</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {error && (
            <div>
              <Alert variant="destructive">
                <AlertTitle>Login Gagal!</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Your email..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="transition-all duration-500 ease-in-out">
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <FormControl>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={!isValid}>
                Log In
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="mt-4" />
    </div>
  );
};

export default Login;
