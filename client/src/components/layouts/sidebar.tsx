"use client";

import { UserNav } from "@/components/layouts/user-nav";
import { MainNav } from "@/components/layouts/header";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

const roles = {
  departemen: [
    { name: "Dashboard", href: "/departemen/dashboard" },
    { name: "Profil", href: "/departemen/profil" },
    { name: "Data Mahasiswa", href: "/departemen/datamahasiswa" },
    { name: "Data PKL", href: "/departemen/pkl" },
    { name: "Data Skripsi", href: "/departemen/skripsi" },
  ],
  dosen: [
    { name: "Dashboard", href: "/dosen/dashboard" },
    { name: "Profil", href: "/dosen/profil" },
    { name: "Data Mahasiswa", href: "/dosen/datamahasiswa" },
    { name: "Verifikasi Berkas", href: "/dosen/verifikasi" },
    { name: "Data PKL", href: "/dosen/pkl" },
    { name: "Data Skripsi", href: "/dosen/skripsi" },
  ],
  mahasiswa: [
    { name: "Dashboard", href: "/mahasiswa/dashboard" },
    { name: "Profil", href: "/mahasiswa/profil" },
    { name: "IRS", href: "/mahasiswa/irs" },
    { name: "KHS", href: "/mahasiswa/khs" },
    { name: "PKL", href: "/mahasiswa/pkl" },
    { name: "Skripsi", href: "/mahasiswa/skripsi" },
  ],
  operator: [
    { name: "Dashboard", href: "/operator/dashboard" },
    { name: "Profil", href: "/operator/profil" },
    { name: "Generate Akun", href: "/operator/generate" },
    { name: "Manajemen Akun", href: "/operator/manajemen" },
    { name: "Data Mahasiswa", href: "/operator/datamahasiswa" },
  ],
};

export function NavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = session?.user?.role; // Retrieve the user's role from the session

  const navigationLinks = roles["mahasiswa"];

  return (
    <>

      <div className="flex">
        <aside className="sticky top-0 h-screen w-60 bg-white text-gray-800 p-4">
          <nav className="space-y-2">
            {navigationLinks.map((link) => (
              <button
                key={link.href}
                className={`w-full flex items-center space-x-2 ${
                  pathname === link.href ? "bg-gray-200" : "hover:bg-gray-200"
                } active:bg-gray-300 py-2 px-2 rounded-lg text-gray-800 transition-colors hover:bg-orange-200`}
                onClick={() => {
                  router.push(link.href);
                }}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                <span className="text-sm font-medium">{link.name}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* <div className="p-6">
          <h1 className="text-lg font-medium">Dashboard</h1>
          <p>hd</p>
        </div> */}


      </div>
    </>
  );
}

export default NavBar;
