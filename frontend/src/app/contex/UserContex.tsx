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
  // Inicializamos los estados leyendo de localStorage de forma síncrona.
  // Esto asegura que al recargar la página, los datos persistan en el estado.
  // Nota: Usamos funciones de inicialización para evitar ejecutar localStorage en cada render,
  // y además verificamos que window exista (para evitar errores en SSR con Next.js).

  // Estado del usuario: lo leemos desde localStorage si existe
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    }
    return null;
  });

  // Estado del token de acceso
  const [access_token, setAccessToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  });

  // Estado de logged in: lo derivamos de la existencia del token (o del usuario)
  // Pero como es un estado separado, lo inicializamos también desde localStorage
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('access_token');
    }
    return false;
  });

  const [totalIngresos, setTotalIngresos] = useState<number>(0);
  const [totalGastos, setTotalGastos] = useState<number>(0);
  const [saldoTotal, setSaldoTotal] = useState<number>(0);

  // Función para manejar el login
  const loginUser = async (email: string, password: string) => {
    try {
      const loginResponse = await fetch("http://127.0.0.1:8000/login_user/", {
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
      const profileResponse = await fetch("http://127.0.0.1:8000/user_profile/", {
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

      const response = await fetch("http://127.0.0.1:8000/totales_usuario/", {
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

  // Opcional: Podríamos agregar un efecto para sincronizar isLoggedIn con user/token
  // Pero ya lo manejamos en login y logout. Sin embargo, por si acaso, podemos hacer:
  useEffect(() => {
    // Si no hay token pero isLoggedIn es true, lo corregimos (esto podría ocurrir si se borra localStorage externamente)
    if (!access_token && isLoggedIn) {
      setIsLoggedIn(false);
    }
  }, [access_token, isLoggedIn]);

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
