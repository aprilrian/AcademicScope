"use client";

import Link from "next/link";
import { UserNav } from "@/components/layouts/user-nav";
import { cn } from "@/lib/utils";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <div className="hidden flex-col md:flex">
        <div className="border-b border-gray-300 py-2 px-4">
          <div className="flex h-16 items-center">
            <Link
              href="/mahasiswa/dashboard"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              <div className="flex items-center space-x-1">
                <img
                  alt="AcademicScopeLogo"
                  height="30"
                  src="/logo.png"
                  style={{
                    aspectRatio: "30/30",
                    objectFit: "cover",
                  }}
                  width="30"
                />
                <h1 className="text-lg font-medium">AcademicScope</h1>
              </div>
            </Link>

            <div className="flex">
              <main className="flex-grow p-6">
                <div className="flex justify-between items-center mb-4"></div>
                <div className="absolute top-0 right-0 p-4 w-50 h-50">
                  <UserNav />
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default MainNav;
