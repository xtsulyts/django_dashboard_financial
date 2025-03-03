"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../contex/UserContex";


function Login() {
  const { loginUser } = useUser();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    setError(null); // Resetear error antes de la petición

    try {
      const response: Response = await fetch("http://localhost:8000/login_user/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        
      });
      

      if (!response.ok) {
        throw new Error("Credenciales inválidas o error del servidor.");
      }

      const { access_token, message } = await response.json(); // Extraer el access_token de la respuesta
      console.log("Token de acceso:", access_token);
      console.log(message)
      


      // Obtener los datos del usuario
      const profileResponse = await fetch("http://localhost:8000/user_profile/", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${access_token}`, // Enviar el token en el header
        },
      });

      if (!profileResponse.ok) {
        throw new Error("Error al obtener los datos del usuario.");
 
      }
      alert("Login exitoso!!")

      const userData = await profileResponse.json(); // Obtener los datos del usuario
      console.log("Datos que devuelve URL/user_profile backend django:", userData);

      // Actualizar el estado del usuario antes de redirigir
      loginUser(userData);

      // Redirigir al usuario a la página de inicio
      router.push('./home');

    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleExit = () => {
    router.push('./')
  }

  return (
    <div className="flex flex-col items-center p-8 min-h-screen bg-gray-100">
       {/* Título principal */}
       <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Your Financial</h1>
      </div>
  

      <div>
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm space-y-4"
      >
               {/* Logo */}
       <div className="mb-8">
        <video
          src="/LogoYourFinancial.webm"
          autoPlay
          loop
          muted
          className="w-130 h-50 mx-auto"
        />
      </div>
      
        <h1 className="text-xl font-bold text-center">Inicia Sesión</h1>
  
        <input
          type="email"
          placeholder="Usuario/Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
  
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
  
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Iniciar Sesión
        </button>

        <button
            onClick={handleExit} // Asigna la función handleLogout al botón
            className="bg-red-500 text-white px-4 py-2 rounded-md w-full font-semibold hover:bg-red-600 transition duration-300 mt-4"
          >
            Volver
          </button>
  
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
      </form>

      
      </div>
       
    </div>
    
  );
  
}

export default Login;