"use client"
;
import { useState } from "react";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    setError(null); // Resetear error antes de la petición

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Credenciales inválidas o error del servidor.");
      }

      const data = await response.json();
      console.log("Datos del usuario:", data);
      // Redirigir o manejar sesión si el backend devuelve un token
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4">
      <h1 className="text-xl font-bold">Inicia Sesión</h1>
      <input
        type="email"
        placeholder="Correo Electrónico"
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
