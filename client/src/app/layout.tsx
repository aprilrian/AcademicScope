import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Providers from "@/components/providers";
import { cn } from "@/lib/utils";

import "../styles/globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme/theme-provider";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Academic Scope",
  description: "membantu proses mengajarmu",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) 
{
  return (
    <html lang="en">
      <body
        className={cn(
          inter.className,
          "antialiased transition-all duration-200 ease-in-out"
        )}
      >
        {" "}
        <main>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Providers>

              {children}
              <Toaster />
              
            </Providers>
          </ThemeProvider>
        </main>
      </body>
    </html>
  );
}
