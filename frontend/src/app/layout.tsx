//"use client"

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserProvider } from "./contex/UserContex";
import Header from "./component/Header";
import { TransactionProvider } from "./contex/TransactionContex";
<<<<<<< HEAD
import Header from "./component/Header";
=======
>>>>>>> 8e30cb741938aff59055bbbe3ef82af3f82cab26
import Footer from "./component/Footer";
import Nav from "./component/Nav";

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
        <Nav/>
        {children}
        <Footer/>
      </body>
    </html>
    </UserProvider>
    </TransactionProvider>
  );
}
