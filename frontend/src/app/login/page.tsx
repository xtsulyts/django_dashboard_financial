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

      const { access_token } = await response.json(); // Extraer el access_token de la respuesta
      console.log("Token de acceso:", access_token);

      // Obtener los datos del usuario
      const profileResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user_profile/`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${access_token}`, // Enviar el token en el header
        },
      });

      if (!profileResponse.ok) {
        throw new Error("Error al obtener los datos del usuario.");
      }

      const userData = await profileResponse.json(); // Obtener los datos del usuario
      console.log("Datos del usuario:", userData);

      // Actualizar el estado del usuario antes de redirigir
      loginUser(userData);

      // Redirigir al usuario a la página de inicio
      router.push('./home');

    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4">
      <h1 className="text-xl font-bold">Inicia Sesiónnnnnn</h1>
      {/* <input
        type="user"
        placeholder="Usuario"
        value={user}
        onChange={(e) => setUser(e.target.value)}
        className="p-2 border rounded"
      /> */}
      <input
        type="email"
        placeholder="Usuario/Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="p-2 border rounded"
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="p-2 border rounded"
      />
      <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
        Iniciar Sesión
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}

export default Login;