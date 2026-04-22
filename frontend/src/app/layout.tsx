//"use client"

import type { Metadata } from "next";
import { Inter, DM_Mono } from "next/font/google";
import "./globals.css";
import { UserProvider } from "./contex/UserContex";
import Header from "./component/Header";
import { TransactionProvider } from "./contex/TransactionContex";
import Footer from "./component/Footer";
import Nav from "./component/Nav";
import ThemeProvider from "./component/ThemeProvider";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
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
    
    <UserProvider>
      <TransactionProvider>
      <html lang="es" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${dmMono.variable} antialiased`}
      >
        <ThemeProvider>
          <Toaster position="top-right" richColors closeButton />
          <Header/>
          <Nav/>
          {children}
          <Footer/>
        </ThemeProvider>
      </body>
    </html>
    </TransactionProvider>
    </UserProvider>
    
  );
}
