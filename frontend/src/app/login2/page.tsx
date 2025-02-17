"use client"
;
import React, { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null); // Estado para almacenar los datos del usuario

  const handleLogin = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    setError(null); // Resetear error antes de la petición

    try {
      // 1. Hacer login para obtener los tokens
      const loginResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login_user/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }), // Asegúrate de que el backend espera `email` y `password`
      });

      if (!loginResponse.ok) {
        throw new Error("Credenciales inválidas o error del servidor.");
      }

      const { access_token } = await loginResponse.json(); // Extraer el access_token de la respuesta

      // 2. Usar el access_token para obtener los datos del usuario
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
      setUserData(userData); // Guardar los datos del usuario en el estado
      console.log("Datos del usuario:", userData);

    } catch (err) {
      setError(err.message); // Mostrar el error en caso de fallo
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Iniciar sesión</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {userData && (
        <div>
          <h2>Datos del usuario:</h2>
          <pre>{JSON.stringify(userData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}