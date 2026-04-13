"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";

// Definir la estructura de los datos del usuario
interface User {
  id: number;
  user: string;
  email: string;
  role: "admin" | "user";
  avatar?: string; // Agregar campo avatar
}

// Definir la estructura del contexto
interface UserContextType {
  user: User | null;
  access_token: string | null;
  totalIngresos: number;
  totalGastos: number;
  saldoTotal: number;
  isLoggedIn: boolean;
  loginUser: (email: string, password: string) => Promise<void>;
  logoutUser: () => void;
  fetchTotales: () => Promise<void>; // Nueva función para obtener los totales
}

// Crear el contexto con un valor inicial vacío
const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [access_token, setAccessToken] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const [totalIngresos, setTotalIngresos] = useState<number>(0);
  const [totalGastos, setTotalGastos] = useState<number>(0);
  const [saldoTotal, setSaldoTotal] = useState<number>(0);

  // Leer localStorage solo en el cliente, después de la hidratación
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('access_token');
    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedToken) {
      setAccessToken(storedToken);
      setIsLoggedIn(true);
    }
  }, []);

  // Función para manejar el login
  const loginUser = async (email: string, password: string) => {
    try {
      const loginResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login_user/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!loginResponse.ok) {
        throw new Error("Credenciales inválidas o error del servidor.");
      }

      const { access_token, message, refresh_token } = await loginResponse.json();
      setAccessToken(access_token);
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("messege", message);
      localStorage.setItem("refresh_token", refresh_token);

      // Obtener perfil de usuario
      const profileResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user_profile/`, {
        method: "GET",
        headers: { Authorization: `Bearer ${access_token}` },
      });

      if (!profileResponse.ok) {
        throw new Error("Error al obtener los datos del usuario.");
      }

      const userData = await profileResponse.json();
      const avatar = userData.avatar || `https://api.dicebear.com/9.x/shapes/svg?seed=${userData.user}`;
      const userWithAvatar = { ...userData, avatar };

      setUser(userWithAvatar);
      localStorage.setItem("user", JSON.stringify(userWithAvatar));

      // Actualizar estado de logged in
      setIsLoggedIn(true);
      console.log("Usuario logueado");
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const logoutUser = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    setTotalIngresos(0);
    setTotalGastos(0);
    setSaldoTotal(0);
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("messege");
    localStorage.removeItem("refresh_token"); // También limpiamos refresh_token
    setIsLoggedIn(false);
    console.log("Usuario cerró sesión");
  }, []); // Las dependencias son seguras porque los setters son estables

  const fetchTotales = useCallback(async () => {
    try {
      if (!access_token) {
        throw new Error("No hay token de acceso. Por favor, inicia sesión.");
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/totales_usuario/`, {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      if (!response.ok) {
        if (response.status === 401) {
          logoutUser();
          throw new Error("Token inválido o expirado. Por favor, inicia sesión nuevamente.");
        } else {
          throw new Error("Error al obtener los totales.");
        }
      }

      const data = await response.json();
      setTotalIngresos(data.total_ingresos);
      setTotalGastos(data.total_gastos);
      setSaldoTotal(data.saldo_total);
    } catch (error) {
      console.error("Error fetching totales:", error);
      throw error;
    }
  }, [access_token, logoutUser]);

  // Efecto para cargar los totales cuando tengamos access_token (incluye la hidratación inicial)
  useEffect(() => {
    if (access_token) {
      fetchTotales();
    }
  }, [access_token, fetchTotales]);


  return (
    <UserContext.Provider
      value={{
        isLoggedIn,
        user,
        access_token,
        totalIngresos,
        totalGastos,
        saldoTotal,
        loginUser,
        logoutUser,
        fetchTotales,
      }}
    >
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
