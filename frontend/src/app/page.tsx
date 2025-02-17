// import Image from "next/image";
// import Footer from "./component/Footer";
// import Login from "./login/page";
// import Header from "./component/header";
import AuthComponent from "./register_user/page";
import { UserProvider } from "./contex/UserContex";


export default function Home() {
  
  return (
    <>
    
      <UserProvider>
      <AuthComponent/>
      </UserProvider>
    
    
    </>
  );
}
