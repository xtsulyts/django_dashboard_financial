"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Login from "../login/page";
import React from "react";

const AuthComponent = () => {
  const router = useRouter();
  const [showForm, setShowForm] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<any>({});

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
        alert("Usuario creado con éxito");
        setShowForm(null);
        router.push("./home");
      }
    } catch (error: any) {
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        alert("Error en el registro. Revisa los datos.");
      }
    }
  };

  return (
    <div
      className="relative flex flex-col items-center
       justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/yourFinancialPhotoInicio.webp')" }} // Ruta de la imagen de fondo
    >
      {/* Navbar */}
      
      <h2 className="absolute top-40 left-38 text-6xl font-bold text-gray-800">
  Your Financial
</h2>

        <div className="absolute top-5 right-5 flex gap-4">
  <button
    className="bg-blue-500 text-white px-5 py-2.5 rounded-full font-semibold shadow-lg hover:bg-blue-600 hover:scale-105 transition-all duration-300"
    onClick={() => setShowForm("signup")}
  >
    Regístrate
  </button>
  <button
    className="bg-green-500 text-white px-5 py-2.5 rounded-full font-semibold shadow-lg hover:bg-green-600 hover:scale-105 transition-all duration-300"
    onClick={() => setShowForm("login")}
  >
    Iniciar sesión
  </button>
</div>

      

      {/* FORMULARIO */}
      {(showForm === "signup" || showForm === "login") && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-sm z-10">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full relative">
            {showForm === "signup" ? (
              <>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  Registro de Usuario
                </h2>

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

                <button
                  type="submit"
                  onClick={handleRegister}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full font-semibold hover:bg-blue-700 transition duration-300"
                >
                  Registrarse
                </button>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  Iniciar Sesión
                </h2>
                <Login></Login>
              </>
            )}

            <button
              onClick={() => setShowForm(null)}
              className="bg-red-500 text-white px-4 py-2 rounded-md w-full font-semibold hover:bg-red-600 transition duration-300 mt-4"
            >
              Volver
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthComponent;
