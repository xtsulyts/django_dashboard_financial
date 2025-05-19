"use client";

<<<<<<< HEAD

import AuthComponent  from "../component/Auth";
//import Header from "../component/Header";
import { useUser } from "@/app/contex/UserContex"
export default function Inicio() {

  const {user} = useUser()
  console.log(user)
=======
import Inicio  from "../component/Inicio";
//import Header from "../component/Header";


export default function InicioPages() {
>>>>>>> 8e30cb741938aff59055bbbe3ef82af3f82cab26
  
    return (
      <>
     
<<<<<<< HEAD
        
        <AuthComponent/>
        
=======
      <Inicio/>
      
>>>>>>> 8e30cb741938aff59055bbbe3ef82af3f82cab26
  
      </>
    );
  }
  
