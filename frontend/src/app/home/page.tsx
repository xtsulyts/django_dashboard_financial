"use client";

import CardUsuario from "../component/CardUsuario";
import Footer from "../component/Footer";
import Header from "../component/Header";
import { UserProvider } from "../contex/UserContex";


export default function Home() {
  
    return (
      <>
        <Header/>
        <UserProvider>
        <CardUsuario/>
        </UserProvider>
        <Footer/>
  
      </>
    );
  }
  