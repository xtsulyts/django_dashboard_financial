"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Login from "../login/page";

/**
 * Componente de registro y control inicial de opciones
 * @returns JSX.Element
 */
const AuthComponent = () => {
  const router = useRouter();
  const [showForm, setShowForm] = useState<string | null>(null); // Maneja la vista actual (login o sign up)
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<any>({}); // Para almacenar los errores del backend

  /**
   * Envía los datos del formulario de registro al backend de Django
   */
  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/", {
        username,
        email,
        password1: password,
        password2: confirmPassword,
      });

      if (response.status === 201) {
        alert("Usuario creado con exito");
        console.log("Datos del usuario cargados exitosamente!", ({username, email, password}) );
        setShowForm(null); // Resetea el componente tras registro
        router.push('./home');
      }
    } catch (error: any) {
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors); // Guardar los errores del backend
      } else {
        alert("Error en el registro. Revisa los datos.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center p-8">
      {!showForm && (
        <>
          <button
            className="bg-blue-500 text-white px-4 py-2 m-2 rounded"
            onClick={() => setShowForm("signup")}
          >
            Sign Up
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 m-2 rounded"
            onClick={() => setShowForm("login")}
          >
            Login
          </button>
        </>
      )}


      {showForm === "login" && <Login />} {/* Renderizado condicional del componente Login */}

      {showForm === "signup" && (
        <form onSubmit={handleRegister} className="w-full max-w-sm">
          <h2 className="text-xl font-bold mb-4">Registro de Usuario</h2>

          <label className="block mb-2">Nombre de Usuario:</label>
          <input
            type="text"
            className={`border p-2 w-full mb-4 ${errors.username ? "border-red-500" : ""}`}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          {errors.username && <p className="text-red-500 text-xs">{errors.username}</p>}

          <label className="block mb-2">Correo Electrónico:</label>
          <input
            type="email"
            className={`border p-2 w-full mb-4 ${errors.email ? "border-red-500" : ""}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}

          <label className="block mb-2">Contraseña:</label>
          <input
            type="password"
            className={`border p-2 w-full mb-4 ${errors.password1 ? "border-red-500" : ""}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errors.password1 && <p className="text-red-500 text-xs">{errors.password1}</p>}

          <label className="block mb-2">Confirmar Contraseña:</label>
          <input
            type="password"
            className={`border p-2 w-full mb-4 ${errors.password2 ? "border-red-500" : ""}`}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {errors.password2 && <p className="text-red-500 text-xs">{errors.password2}</p>}

          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Registrarse
          </button>
        </form>
      )}

     
    </div>
  );
};

export default AuthComponent;

