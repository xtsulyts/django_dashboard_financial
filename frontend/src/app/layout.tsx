//"use client"

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserProvider } from "./contex/UserContex";
import Layout from "./component/layout";
import { TransactionProvider } from "./contex/TransactionContex";
import Header from "./component/Header";
import Footer from "./component/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "App django dashboard financial",
  description: "Aplicacion de visualizacion de costos",
};

// interface RootLayoutProps {
//   children: React.ReactNode; // Tipo para children
// }

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TransactionProvider>
    <UserProvider>
      <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header/>
        {children}
        <Footer/>
      </body>
    </html>
    </UserProvider>
    </TransactionProvider>
  );
}
