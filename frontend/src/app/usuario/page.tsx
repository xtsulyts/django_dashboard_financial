"use client";

import CardUsuario from "../component/CardUsuario";
import Footer from "../component/Footer";
import Nav from "../component/Nav";
//import Header from "../component/Header";
import { useUser } from "../contex/UserContex";


export default function Home() {
  const {user} = useUser();
  
    return (
      <>
       
       
        <Nav/>
        <CardUsuario usuario={user}/>
        <Footer/>
      
  
      </>
    );
  }
  