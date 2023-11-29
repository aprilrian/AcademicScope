import type { Metadata } from "next";
import { Inter } from "next/font/google";


import { cn } from "@/lib/utils";

import Sidebar from "@/components/layouts/Sidebar";
import Header from "@/components/layouts/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Academic Scope",
  description: "membantu proses mengajarmu",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentPath =
    typeof window !== "undefined" ? window.location.pathname : "";

  // Periksa apakah URL saat ini adalah '/login'
  const isLoginPage = currentPath === "/login";

  return (
    <html lang="en">
      <body
        className={cn(
          inter.className,
          "antialiased transition-all duration-200 ease-in-out"
        )}
      >
        <main>
          <div className="flex flex-col min-h-screen">
            <div>
              <Header />
            </div>

            {isLoginPage ? (
              <div className="basis-1/6">{children}</div>
            ) : (
              <div className=" flex flex-row">
                <div className="basis-1/6">
                  <Sidebar />
                </div>
                <div className="basis-5/6">{children}</div>
              </div>
            )}
          </div>
        </main>
      </body>
    </html>
  );
}
