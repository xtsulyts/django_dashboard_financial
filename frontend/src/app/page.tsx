

import { UserProvider } from "./contex/UserContex";
import InicioPages from "./inicio/page";



export default function App() {
  
  return (
    <>
    
      <UserProvider>
       
         <InicioPages/>
        
      </UserProvider>
    
    
    </>
  );
}
