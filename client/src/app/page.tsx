import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { UserAuthForm } from "@/components/auth/user-auth-form";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

export default function AuthenticationPage() {
  return (
    <>
      <div className="md:hidden">
        <Image
          src="/public/wallpaper.jpeg"
          width={1200}
          height={843}
          alt="Authentication"
          className="block dark:hidden"
        />
        <Image
          src="/public/wallpaper.jpeg"
          width={1280}
          height={843}
          alt="Authentication"
          className="hidden dark:block"
        />
      </div>

      <div className="container relative hidden h-[800px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Link
          href="/login"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute right-4 top-4 md:right-8 md:top-8"
          )}
        >
          Login
        </Link>
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative z-20 flex items-center text-lg font-medium">
          <img
            alt="AcademicScopeLogo"
            height="30"
            src="/logo.png"
            style={{
              aspectRatio: "30/30",
              objectFit: "cover",
            }}
            width="30"></img>
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />

            AcademicScope
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;"Empower educators with our cutting-edge software to
                effortlessly track and enhance student progress, fostering a
                collaborative and data-driven educational journey.".&rdquo;
              </p>
              <footer className="text-sm">Christian Joshua</footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">Welcome</h1>
              <p className="text-sm text-muted-foreground">
                
              </p>
            </div>
            {/* <UserAuthForm /> */}
            {/* <link href="/login">
              <Button>Sign In</Button>
            </link> */}
          </div>
        </div>
      </div>
    </>
  );
}
