
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
