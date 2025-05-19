"use client";

import CardUsuario from "../component/CardUsuario";
<<<<<<< HEAD
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
  
=======

export default function Home() {
  return (
    <>
      <CardUsuario />
    </>
  );
}
>>>>>>> 8e30cb741938aff59055bbbe3ef82af3f82cab26
