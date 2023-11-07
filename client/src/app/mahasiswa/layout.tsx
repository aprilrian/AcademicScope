import type { Metadata } from "next";
import NavBar from "@/components/layouts/sidebar";
import { MainNav } from "@/components/layouts/header";

export const metadata: Metadata = {
  title: "AcademicScope",
  description: "",
};

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <div className="flex flex-col min-h-screen">
        <div>
          <MainNav />
        </div>

        <div className=" flex flex-row">
          <div className="basis-1/6">
            <NavBar />
          </div>
          <div className="basis-5/6">{children}</div>
        </div>
      </div>
    </main>
  );
}
