"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { createAvatar } from '@dicebear/core';
import { pixelArt } from '@dicebear/collection';

// Definir la estructura de los datos del usuario
interface User {
  username: string;
  email: string;
  role: "admin" | "user";
  avatar?: string;  // Agregar campo avatar
}

// Definir la estructura del contexto
interface UserContextType {
  user: User | null;
  loginUser: (userData: User) => void;
  logoutUser: () => void;
}

// Crear el contexto con un valor inicial vacío
const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Cargar el usuario desde el localStorage al iniciar la aplicación
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Generar el avatar con DiceBear
  const generateAvatar = (username: string): string => {
    return `https://api.dicebear.com/9.x/pixel-art/svg?seed=${username}`;
  };

  // En loginUser, asegurarse de almacenar el avatar
  const loginUser = (userData: User) => {
    const avatar = userData.avatar|| `https://api.dicebear.com/9.x/pixel-art/svg?seed=${userData.user}`;
    const userWithAvatar = { ...userData, avatar };
    setUser(userWithAvatar);
    localStorage.setItem("user", JSON.stringify(userWithAvatar));
  };

  // Función para cerrar sesión
  const logoutUser = () => {
    setUser(null); // Elimina el usuario del estado
    localStorage.removeItem("user"); // Elimina el usuario del almacenamiento local
  };

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser }}>
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

