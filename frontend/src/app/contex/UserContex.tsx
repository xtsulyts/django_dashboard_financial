"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

// Definir la estructura de los datos del usuario
interface User {
  id: number;
  username: string;
  email: string;
  role: "admin" | "user";
  avatar?: string;  // Agregar campo avatar
}

// Definir la estructura del contexto
interface UserContextType {
  user: User | null;
  access_token: string | null;
  loginUser: (email: string, password: string) => Promise<void>;
  logoutUser: () => void;
}

// Crear el contexto con un valor inicial vacío
const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [access_token, setAccessToken] = useState<string | null>(null);

  // Cargar el usuario desde el localStorage al iniciar la aplicación
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("access_token");
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setAccessToken(storedToken);
    }
  }, []);

  // Función para manejar el login
  const loginUser = async (email: string, password: string) => {
    try {
      // Hacer la solicitud al endpoint de login
      const loginResponse = await fetch("http://localhost:8000/login_user/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!loginResponse.ok) {
        throw new Error("Credenciales inválidas o error del servidor.");
      }

      const { access_token, message } = await loginResponse.json();
      setAccessToken(access_token); // Almacenar el token en el estado
      localStorage.setItem("access_token", access_token); // Guardar el token en localStorage

      // Hacer la solicitud al endpoint de perfil de usuario
      const profileResponse = await fetch("http://localhost:8000/user_profile/", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${access_token}`,
        },
      });

      if (!profileResponse.ok) {
        throw new Error("Error al obtener los datos del usuario.");
      }

      const userData = await profileResponse.json();
      const avatar = userData.avatar || `https://api.dicebear.com/9.x/shapes/svg?seed=${userData.username}`;
      const userWithAvatar = { ...userData, avatar };

      setUser(userWithAvatar); // Almacenar los datos del usuario en el estado
      localStorage.setItem("user", JSON.stringify(userWithAvatar)); // Guardar los datos del usuario en localStorage

      console.log("Login exitoso:", message);
    } catch (error) {
      console.error(error);
      throw error; // Propagar el error para manejarlo en el componente
    }
  };

  // Función para cerrar sesión
  const logoutUser = () => {
    setUser(null); // Eliminar el usuario del estado
    setAccessToken(null); // Eliminar el token del estado
    localStorage.removeItem("user"); // Eliminar el usuario del localStorage
    localStorage.removeItem("access_token"); // Eliminar el token del localStorage
  };

  return (
    <UserContext.Provider value={{ user, access_token, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook personalizado para acceder al contexto de usuario
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser debe usarse dentro de un UserProvider");
  }
  return context;
};

















// "use client";

// import { createContext, useContext, useEffect, useState, ReactNode } from "react";

// // Definir la estructura de los datos del usuario
// interface User {
//   id: number;
//   username: string;
//   email: string;
//   role: "admin" | "user";
//   avatar?: string;  // Agregar campo avatar
// }

// // Definir la estructura del contexto
// interface UserContextType {
//   user: User | null;
//   loginUser: (userData: User) => void;
//   logoutUser: () => void;
// }

// // Crear el contexto con un valor inicial vacío
// const UserContext = createContext<UserContextType | undefined>(undefined);

// export const UserProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [access_token, setAccessToken] = useState(null);

  
//   // Cargar el usuario desde el localStorage al iniciar la aplicación
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);



//   // En loginUser, asegurarse de almacenar el avatar
//   const loginUser = async (userData: User) => {
//     const avatar = userData.avatar|| `https://api.dicebear.com/9.x/shapes/svg?seed=${userData.user}`;
//     const userWithAvatar = { ...userData, avatar };
//     console.log("userData me devuelve el id del usuario",userData.id)
//     setUser(userWithAvatar);
//     localStorage.setItem("user", JSON.stringify(userWithAvatar));
//     console.log(localStorage.getItem("user"))

    
  
//     try {
//       const response = await fetch("http://localhost:8000/login_user/", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ userData }),
//       });

//       if (!response.ok) {
//         throw new Error("Credenciales inválidas desde context.");
//       }

//       const { access_token, message } = await response.json();
//       setAccessToken(access_token); // Almacenar el token en el estado
//       console.log("Token de acceso:", access_token);
//       console.log(message);
//     } catch (error) {
//       console.error(error);
      
//       // Obtener los datos del usuario
//       const profileResponse = await fetch("http://localhost:8000/user_profile/", {
//         method: "GET",
//         headers: {
//           "Authorization": `Bearer ${access_token}`, // Enviar el token en el header
//         },
//       });

//     }
  

//   };

  


//   // Función para cerrar sesión
//   const logoutUser = () => {
//     setUser(null); // Elimina el usuario del estado
//     localStorage.removeItem("user"); // Elimina el usuario del almacenamiento local
//     //eliminar todos los ítems almacenados en localStorage
//     localStorage.clear()
//   };

//   return (
//     <UserContext.Provider value={{ user, loginUser, logoutUser }}>
//       {children}
//     </UserContext.Provider>
//   );

  
// };



// // Hook personalizado para acceder al contexto de usuario
// export const useUser = (): UserContextType => {
//   const context = useContext(UserContext);
//   if (!context) {
//     throw new Error("useUser debe usarse dentro de un UserProvider");
//   }
//   return context;
// };

