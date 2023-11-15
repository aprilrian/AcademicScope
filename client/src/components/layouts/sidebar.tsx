"use client";

import { UserNav } from "@/components/layouts/user-nav";
import { MainNav } from "@/components/layouts/header";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

const roles = {
  departemen: [
    { name: "Dashboard", href: "/dept/dashboard" },
    { name: "Profil", href: "/dept/profil" },
    { name: "Data Mahasiswa", href: "/dept/datamahasiswa" },
    { name: "Data PKL", href: "/dept/pkl" },
    { name: "Data Skripsi", href: "/dept/skripsi" },
  ],
  dosen: [
    { name: "Dashboard", href: "/doswal/dashboard" },
    { name: "Profil", href: "/doswal/profil" },
    { name: "Data Mahasiswa", href: "/doswal/datamahasiswa" },
    { name: "Verifikasi Berkas", href: "/doswal/verifikasi" },
    { name: "Data PKL", href: "/doswal/pkl" },
    { name: "Data Skripsi", href: "/doswal/skripsi" },
  ],
  mahasiswa: [
    { name: "Dashboard", href: "/mhs/dashboard" },
    { name: "Profil", href: "/mhs/profil" },
    { name: "IRS", href: "/mhs/irs" },
    { name: "KHS", href: "/mhs/khs" },
    { name: "PKL", href: "/mhs/pkl" },
    { name: "Skripsi", href: "/mhs/skripsi" },
  ],
  operator: [
    { name: "Dashboard", href: "/admin/dashboard" },
    { name: "Profil", href: "/admin/profil" },
    { name: "Generate Akun", href: "/admin/generate" },
    { name: "Manajemen Akun", href: "/admin/manajemen" },
    { name: "Data Mahasiswa", href: "/admin/datamahasiswa" },
  ],
};

export function NavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = session?.user?.role; // Retrieve the user's role from the session

  const navigationLinks = roles[userRole] || [];

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
