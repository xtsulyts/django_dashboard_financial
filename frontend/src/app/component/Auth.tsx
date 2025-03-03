"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Login from "../login/page";
import Footer from "../component/Footer";
import React from 'react';


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
        console.log("Datos del usuario cargados exitosamente!", ({ username, email, password }));
        setShowForm(null); // Resetea el componente tras registro
        router.push('./login');
      }
    } catch (error: any) {
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors); // Guardar los errores del backend
      } else {
        alert("Error en el registro. Revisa los datos.");
      }
    }
  };


  const handleExit = () => {
    window.location.reload();
  }


  return (
    <div className="flex flex-col items-center p-8 min-h-screen bg-gray-100">
      {/* Título principal */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Your Financial</h1>
      </div>

      


      {/* Contenedor de las opciones de login o registro */}
      {!showForm && (
        <div className="flex flex-col gap-6 w-full max-w-sm bg-white p-6 rounded-lg shadow-lg">

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

          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-full w-full font-semibold hover:bg-blue-600 transition duration-300"
            onClick={() => setShowForm("signup")}
          >
            Regístrate
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-full w-full font-semibold hover:bg-green-600 transition duration-300"
            onClick={() => router.push("./login")}
          >
            Iniciar sesión
          </button>
        </div>
      )}

      {/* Renderizado condicional para login y registro */}
      {showForm === "login" && <Login />}

      {showForm === "signup" && (
        <form
          onSubmit={handleRegister}
          className="flex flex-col items-center w-full max-w-sm bg-white p-8 rounded-lg shadow-md gap-6"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Registro de Usuario</h2>

          {/* Campos del formulario */}
          {[
            { label: "Nombre de Usuario", value: username, setValue: setUsername, error: errors.username },
            { label: "Correo Electrónico", value: email, setValue: setEmail, error: errors.email },
            { label: "Contraseña", value: password, setValue: setPassword, error: errors.password1, type: "password" },
            { label: "Confirmar Contraseña", value: confirmPassword, setValue: setConfirmPassword, error: errors.password2, type: "password" },
          ].map(({ label, value, setValue, error, type = "text" }) => (
            <div className="w-full mb-4" key={label}>
              <label className="text-sm font-medium text-gray-700 mb-2">{label}</label>
              <input
                type={type}
                className={`border p-3 w-full rounded-md ${error ? "border-red-500" : "border-gray-300"}`}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
              />
              {error && <p className="text-red-500 text-xs">{error}</p>}
            </div>
          ))}

          {/* Botones del formulario */}
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full font-semibold hover:bg-blue-700 transition duration-300"
          >
            Registrarse
          </button>

          <button
            onClick={handleExit}
            className="bg-red-500 text-white px-4 py-2 rounded-md w-full font-semibold hover:bg-red-600 transition duration-300 mt-4"
          >
            Volver
          </button>
        </form>
      )}


    </div>
  );



};

export default AuthComponent;



