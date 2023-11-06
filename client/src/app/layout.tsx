import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Providers from "@/components/providers";
import { cn } from "@/lib/utils";

import "../styles/globals.css";

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
  return (
    <html lang="en">
      <body
        className={cn(
          inter.className,
          "antialiased transition-all duration-200 ease-in-out"
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
