"use client";

import localFont from "next/font/local";
import "./globals.css";
import Header from "./_components/Header";
import { Toaster } from "@/components/ui/toaster";
import { Provider } from "@radix-ui/react-toast";
import { SessionProvider } from "next-auth/react";
import React from "react";
import { RoleProvider } from "@/context/RoleContext";
import { EdgeStoreProvider } from "@/lib/edgestore";
import { usePathname } from "next/navigation";



const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// export const metadata: Metadata = {
//   title: "TaskTap",
//   description: "Trustable Service Booking Platform",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideHeaderRoutes = ['/admin'];
  const shouldHideHeader = hideHeaderRoutes.includes(pathname || '');

  
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* <PayPalScriptProvider options={{clientId: "test"}}> */}
        <EdgeStoreProvider>
          <Provider>
            <SessionProvider>
              <RoleProvider>
                <div className="mx-6 md:mx-16">
                  {/* <Header /> */}
                  {!shouldHideHeader && <Header />}
                  {children}
                </div>
              </RoleProvider>
              <Toaster />
            </SessionProvider>
          </Provider>
        </EdgeStoreProvider>
        {/* </PayPalScriptProvider> */}
      </body>
    </html>
  );
}
