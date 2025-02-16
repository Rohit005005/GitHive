import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";

import { TRPCReactProvider } from "@/trpc/react";
import { Toaster } from "@/components/ui/sonner";
import { dark } from '@clerk/themes'


export const metadata: Metadata = {
  title: "GitHive ",
  description: "Made by Rohit",
  icons: [{ rel: "icon", url: "/github_layout.svg" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider
    appearance={{
      baseTheme: dark,
    }}>
      <html lang="en" className={`${GeistSans.variable}`}>
        <body className="bg-gray-700">
          <TRPCReactProvider>{children}</TRPCReactProvider>
          <Toaster richColors/>
        </body>
      </html>
    </ClerkProvider>
  );
}
