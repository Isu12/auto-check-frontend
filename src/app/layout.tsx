import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/side-nav/side-nav";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from "react-toastify";
import Header from "@/components/header/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="flex relative">
          <Sidebar /> {/* Sidebar on the left */}
          <ToastContainer />
          <Header />
          <main className="flex-1 p-4 transition-all duration-200 ml-[70px] md:ml-[50px] mt-[120px]">
            {/* Add margin-top to offset header */}
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
