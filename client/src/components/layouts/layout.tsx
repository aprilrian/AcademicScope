"use client";

import { ReactNode } from "react";
import Header from "./header";
import { usePathname } from "next/navigation";
import NavBar from "./sidebar";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();

  const checkLoginPathname = () => {
    if (pathname === "/" || pathname === "/login") return false;
    else return true;
  };

  return (
    <div className="min-h-screen">
      {checkLoginPathname() && <Header /> && (
        <>
          <Header />
          <NavBar />
        </>
      )}

      {children}
    </div>
  );
}
