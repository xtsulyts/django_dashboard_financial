"use client";


import AuthComponent  from "../component/Auth";
//import Header from "../component/Header";
import { useUser } from "@/app/contex/UserContex"
export default function Inicio() {

  const {user} = useUser()
  console.log(user)
  
    return (
      <>
     
        
        <AuthComponent/>
        
  
      </>
    );
  }
  
