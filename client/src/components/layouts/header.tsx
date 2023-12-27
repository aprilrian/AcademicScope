"use client";

import Link from "next/link";
import { UserNav } from "@/components/layouts/userNav";
import { cn } from "@/lib/utils";

export function Header({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn("flex items-center justify-between px-4 py-5 border-b border-gray-300", className)}
      {...props}
    >
      <div className="flex items-center">
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

      <div className="flex items-center space-x-4">
        <UserNav />
      </div>
    </nav>
  );
}

export default Header;