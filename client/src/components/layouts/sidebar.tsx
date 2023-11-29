"use client";


import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { ReactNode } from 'react';
import { iconMapping } from "../data/nav/iconMapping";


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
    { name: "Profil", href: "/mhs/profile" },
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

interface NavLink {
  name: string;
  href: string;
}

interface NavBarProps {
  children?: ReactNode;
}



export function Sidebar({ children }: NavBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = session?.user?.role as string | undefined; // Ensure userRole is of type string

  const navigationLinks: NavLink[] = roles[userRole] || [];

  return (
    <>
      <div className="flex">
        <aside className="sticky top-0 h-screen w-60 bg-white text-gray-800 p-4">
          <nav className="space-y-2">
            {navigationLinks.map((link: NavLink) => (
              <button
                key={link.href}
                className={`w-full flex items-center space-x-2 ${
                  pathname === link.href ? "bg-gray-200" : "hover:bg-gray-200"
                } active:bg-gray-300 py-2 px-2 rounded-lg text-gray-800 transition-colors hover:bg-orange-200`}
                onClick={() => {
                  router.push(link.href);
                }}
              >
                {iconMapping[link.name]}
                <span className="text-sm font-medium">{link.name}</span>
              </button>
            ))}
          </nav>
          {children}
        </aside>
      </div>
    </>
  );
}

export default Sidebar;