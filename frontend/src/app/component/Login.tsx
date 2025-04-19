
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../contex/UserContex";


function Login() {
  const { loginUser, user } = useUser(); // Obtén la función loginUser del contexto
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  //const { user } = useUser();

  const handleLogin = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setError(null); // Resetear error antes de la petición

    try {
      // Usar la función loginUser del contexto para manejar el login
      const userData = await loginUser(email, password);


      // Redirigir al usuario a la página de inicio
      router.push("./usuario");

    } catch (err: any) {
      setError(err.message); // Manejar errores
    }
  };



  return (


    <div>
      <form
        onSubmit={handleLogin} 
      >
        <h1 className="text-xl font-bold text-center mb-6">Inicia Sesión</h1>

        <input
          type="email"
          placeholder="Usuario/Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Iniciar Sesión
        </button>
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
      </form>
    </div>

  );
}

export default Login;

























