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

//validasi form
const loginSchema = yup
  .object()
  .shape({
    username: yup.string().required(),
    password: yup.string().required(),
  })
  .required();

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  // const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const { data: session } = useSession();
  const userRole = session?.user?.role as string | undefined;
  console.log("UserRole:", userRole);

  const form = useForm({ resolver: yupResolver(loginSchema) });
  const {
    formState: { isValid },
  } = form;

  async function onSubmit(values: any) {
    try {
      setLoading(true);

      const res = await signIn("credentials", {
        redirect: false,
        username: values.username,
        password: values.password,
      });

      if (!res?.error) {
        switch (userRole) {
          case "operator":
            router.push("/admin/dashboard");
            break;
          case "mahasiswa":
            router.push("/mhs/dashboard");
            break;
          case "dosen":
            router.push("/doswal/dashboard");
            break;
          case "departemen":
            router.push("/dept/dashboard");
            break;
          default:
            router.push("/admin/dashboard");
            break;
        }
      } else {
        setError(res?.error);
        form.setError("username", { message: res?.error });
        form.setError("password", { message: res?.error });
      }
    } catch (error: any) {
      if (error) setError(error?.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center bg-no-repeat w-screen"
      style={{ backgroundImage: 'url("/NASA.jpg")' }}
    >
      <Card className="w-full max-w-xs shadow-none">
        <CardHeader className="pb-3 flex flex-col items-center">
          <img src="/logo.png" alt="AcademicScope" className="w-16 h-16" />
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
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email">NIM / NIP</FormLabel>
                    <FormControl>
                      <Input
                        id="username"
                        type="input"
                        placeholder="Your NIM / NIP..."
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
                        placeholder="Your password..."
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
    </div>
  );
};

export default Login;
