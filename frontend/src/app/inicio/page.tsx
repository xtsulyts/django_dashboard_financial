"use client";


import Footer from "../component/Footer";
import Nav from "../component/Nav";
import AuthComponent  from "../component/Auth";
//import Header from "../component/Header";
import { useUser } from "@/app/contex/UserContex"
import { log } from "console";
export default function Inicio() {

  const {user} = useUser()
  console.log(user)
  
    return (
      <>
     
        
        <AuthComponent/>
        
  
      </>
    );
  }
  
