"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Login from "../login/page";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
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
    <div className="relative flex flex-col items-center min-h-screen bg-gray-100">
      {/* Navbar */}
      <div className="w-full flex justify-between items-center p-6 bg-white shadow-md">
        <h1 className="text-3xl font-bold text-gray-800">Your Financial</h1>
        <div className="flex gap-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-600 transition duration-300"
            onClick={() => setShowForm("signup")}
          >
            Regístrate
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-green-600 transition duration-300"
            onClick={() => setShowForm("login")}
          >
            Iniciar sesión
          </button>
        </div>
      </div>

      {/* Hero con Carrusel */}
      <div className="relative w-full max-w-4xl mt-10 z-0">
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          autoplay={{ delay: 3000 }}
          pagination={{ clickable: true }}
          className="w-full h-60 md:h-80 rounded-lg shadow-lg"
        >
          {[
            "Organiza tu presupuesto y toma el control total.",
            "Sincroniza tus cuentas bancarias fácilmente.",
            "Recibe reportes detallados de tus finanzas.",
          ].map((text, index) => (
            <SwiperSlide
              key={index}
              className="flex items-center justify-center bg-blue-500 text-white text-2xl font-semibold rounded-lg p-6"
            >
              {text}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Beneficios */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mt-12 z-0">
        {[
          { title: "Presupuesto Inteligente", desc: "Asigna cada peso y mantén el control total." },
          { title: "Sincronización Bancaria", desc: "Conéctate a tu banco y visualiza todos tus movimientos." },
          { title: "Reportes Detallados", desc: "Gráficos interactivos para analizar tus finanzas." },
        ].map((item, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-semibold text-gray-700">{item.title}</h3>
            <p className="text-gray-600 mt-2">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* FORMULARIOS EN MODAL */}
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
  