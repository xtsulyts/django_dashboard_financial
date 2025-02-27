
import AuthComponent from "./register_user/page";
import { UserProvider } from "./contex/UserContex";


export default function App() {
  
  return (
    <>
    
      <UserProvider>
      <AuthComponent/>
      </UserProvider>
    
    
    </>
  );
}
