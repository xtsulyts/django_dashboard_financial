
//import AuthComponent from "./register_user/page";
import { UserProvider } from "./contex/UserContex";
//import { TransactionProvider  } from "./contex/TransactionContex";
import Inicio from "./inicio/page";


export default function App() {
  
  return (
    <>
    
      <UserProvider>
       
         <Inicio/>
        
      </UserProvider>
    
    
    </>
  );
}
