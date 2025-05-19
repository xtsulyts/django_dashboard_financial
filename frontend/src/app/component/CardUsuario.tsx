// Card.tsx
"use client"; // Esto indica que el componente debe renderizarse en el cliente en Next.js

import { useUser } from "../contex/UserContex"; // Importa el hook personalizado para acceder al contexto de usuario
import { useRouter } from "next/navigation"; // Importa useRouter para manejar redirecciones
import FinanzasChart from "./FinanzasGraf";
//import { useState } from "react";

const CardUsuario = () => {
  // Obtiene el usuario y la función de logout desde el contexto
  const router = useRouter(); // Hook de Next.js para redirección
  const {  user, totalIngresos, totalGastos, saldoTotal } = useUser();


  const handleIngresos = () => {
    router.push("/transacciones") // Usa una ruta absoluta
    console.log("Navegación exitosa"); // Manejo opcional de éxito
    //console.error("Error al navegar:", Error); // Manejo de errores
  };



  
  return (
<div
  className="relative flex flex-col items-center justify-center min-h-screen bg-cover bg-center"
  style={{ backgroundImage: "url('/yourFinancialPhotoInicio.webp')" }} // Fondo con imagen
>
  {/* CardUsuario */}
  <div className="relative bg-white/30 backdrop-blur-md rounded-lg shadow-lg p-8 max-w-2xl w-full my-8"> {/* Agregar my-8 para margen superior e inferior */}
       <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
                  {" "}
                   <img
          src={user?.avatar || `https://api.dicebear.com/9.x/shapes/svg?seed=${user?.user}`}
          alt="Avatar"
          className="w-20 h-20 rounded-full border-4 border-blue-100 shadow-sm"
        />
                  <span className="text-gray-900 dark:text-yellow-400 group-hover:underline">
                    {user?.user || "Invitado"}
                  </span>
                </h1>
 >

    {/* Resumen Financiero */}
    <div className="bg-white/50 backdrop-blur-sm p-6 rounded-lg shadow-sm mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Resumen Financiero</h2>
      <p className="text-lg"><strong>Total Ingresos:</strong> ${totalIngresos.toLocaleString()}</p>
      <p className="text-lg"><strong>Total Gastos:</strong> ${totalGastos.toLocaleString()}</p>
      <p className="text-lg"><strong>Saldo Total:</strong> ${saldoTotal.toLocaleString()}</p>
    </div>

    {/* Gráfico */}
    <div className="bg-white/50 backdrop-blur-sm p-6 rounded-lg shadow-sm mb-8">
      <FinanzasChart />
    </div>

    {/* Botones */}
    {user && (
      <div className="space-y-4">
        <button
          onClick={handleIngresos}
          className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-300"
        >
          Agregar Transacción
        </button>
      </div>
    )}
  </div>
  <div className="relative bg-white/30 backdrop-blur-md rounded-lg shadow-lg p-8 max-w-2xl w-full my-8">
  </div>
</div>
  );
};

export default CardUsuario;
