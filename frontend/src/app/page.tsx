import Image from "next/image";
import Footer from "./component/Footer";
import Login from "./login/page";
import Header from "./component/header";
import AuthComponent from "./register_user/page";


export default function Home() {
  
  return (
    <>
      <Header/>
      <AuthComponent/>
      <Footer/>
    </>
  );
}
