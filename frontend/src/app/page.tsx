import Image from "next/image";
import Footer from "./component/Footer";
import Login from "./login/page";
import Header from "./component/header";
import AuthComponent from "./register_user/page";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Header/>
      <AuthComponent/>
      <Login/>
      <Footer/>
    </div>
  );
}
