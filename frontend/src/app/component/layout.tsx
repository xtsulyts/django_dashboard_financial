import React from "react";
import Header from "./Nav";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode; // Tipo para children
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;