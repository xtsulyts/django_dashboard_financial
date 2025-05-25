"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";


const AuthComponent = () => {

  const router = useRouter();
  // Estados para gestionar el formulario y errores
  const [showForm, setShowForm] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<any>({});
 

  // Función para manejar el registro
  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    // Solicitud HTTP al servidor
    try {
      const response = await axios.post("http://localhost:8000/", {
        username,
        email,
        password1: password,
        password2: confirmPassword,
      });
      // Manejo de respuesta exitosa
      if (response.status === 201) {
        alert("Usuario creado con éxito");
        setShowForm(null); // Oculta el formulario
        router.push("./"); // Redirige al usuario
      }
    } catch (error: any) {
      // Manejo de errores
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors); // Almacena errores del servidor
      } else {
        alert("Error en el registro. Revisa los datos."); // Alerta genérica
      }
    }
   
  };



  return (
<div className="relative flex flex-col items-center justify-center min-h-screen bg-cover bg-center" 
     style={{ backgroundImage: "url('/yourFinancialPhotoInicio.webp')" }}>
  <div className="w-full max-w-md p-8 space-y-6 bg-white bg-opacity-90 rounded-lg shadow-xl">
    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
      Registro de Usuario
    </h2>

    <form className="space-y-4">
      {[
        {
          label: "Nombre de Usuario",
          value: username,
          setValue: setUsername,
          error: errors.username,
          placeholder: "Ingresa tu nombre de usuario"
        },
        {
          label: "Correo Electrónico",
          value: email,
          setValue: setEmail,
          error: errors.email,
          placeholder: "Ingresa tu correo electrónico"
        },
        {
          label: "Contraseña",
          value: password,
          setValue: setPassword,
          error: errors.password1,
          type: "password",
          placeholder: "Crea una contraseña segura"
        },
        {
          label: "Confirmar Contraseña",
          value: confirmPassword,
          setValue: setConfirmPassword,
          error: errors.password2,
          type: "password",
          placeholder: "Repite tu contraseña"
        },
      ].map(({ label, value, setValue, error, type = "text", placeholder }) => (
        <div className="w-full" key={label}>
          <label className="block text-sm font-medium text-gray-700">
            {label}
            <input
              type={type}
              className={`border p-3 w-full rounded-md mt-1 ${
                error ? "border-red-500" : "border-gray-300"
              }`}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={placeholder}
              required
            />
          </label>
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
      ))}

      <div className="flex flex-col space-y-4 pt-2">
        <button
          type="submit"
          onClick={handleRegister}
          className="w-full"
        >
          Registrarse
        </button>
        
        <button
          onClick={() => setShowForm(null)}
          className="w-full bg-red-500 hover:bg-red-600"
        >
          Volver
        </button>
      </div>
    </form>
  </div>
</div>
  );
};

export default AuthComponent;
