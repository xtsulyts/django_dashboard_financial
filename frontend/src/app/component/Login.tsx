
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../contex/UserContex";


function Login() {
  const { loginUser } = useUser(); // Obtén la función loginUser del contexto
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { user } = useUser();

  const handleLogin = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setError(null); // Resetear error antes de la petición

    try {
      // Usar la función loginUser del contexto para manejar el login
      const userData = await loginUser(email, password);

      // Si el login es exitoso, loginUser devuelve los datos del usuario
      console.log("Datos que devuelve URL/user_profile backend django:", user);
      //alert("Login exitoso!!");

      // Redirigir al usuario a la página de inicio
      router.push("./home");
      console.log("Datos que devuelve URL/user_profile backend django:", user);
    } catch (err: any) {
      setError(err.message); // Manejar errores
    }
  };

  const handleExit = () => {
    router.push("./");
  };

  return (
    <div >

      
      {/* Título principal */}
   
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Your Financial</h1>
      

      <div>
        <form
          onSubmit={handleLogin}
          className=" p-6 rounded-lg shadow-lg w-full max-w-sm space-y-4"
        >
          

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
          

          


          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default Login;

























