"use client";

import React, { useState } from 'react'
import FinanzasChart from "./FinanzasGraf";
import { useUser } from "../contex/UserContex";


const Inicio = () => {
     // Hooks para acceder a datos del usuario y enrutamiento
      const { totalIngresos, totalGastos, saldoTotal, user } = useUser();
    





  return (
    <>
    <div
      className="relative flex flex-col items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/yourFinancialPhotoInicio.webp')" }} // Ruta de la imagen de fondo
    >

     {/* Card transparente con fondo difuminado */}
        <div className="relative bg-white/30 backdrop-blur-md rounded-lg shadow-lg p-8 max-w-2xl w-full">
          {/* Logo */}

          {/* Título "Your Financial" */}
          <h2 className="text-6xl  text-gray-800 mb-8">
            Tus Finanzas
          </h2>

              <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
                  {" "}
                   <img
          src={user?.avatar || `https://api.dicebear.com/9.x/shapes/svg?seed=${user?.user}`}
          alt="Avatar"
          className="w-20 h-20 rounded-full border-4 border-blue-100 shadow-sm"
        />
                  <span className="text-yellow-900 dark:text-yellow-400 group-hover:underline">
                    {user?.user || "Invitado"}
                  </span>
                </h1>
          {/* <span className="text-blue-600 font-semibold text-xl">
            {user?.user  }
          </span> */}

          {/* Contenido de la card */}
          <div className="space-y-4">
            {/* Gráfico */}
            <FinanzasChart />

            {/* Totales */}
            <p className="text-lg">
              <strong>Total Ingresos:</strong> ${totalIngresos.toLocaleString()}
            </p>
            <p className="text-lg">
              <strong>Total Gastos:</strong> ${totalGastos.toLocaleString()}
            </p>
            <p className="text-lg">
              <strong>Saldo Total:</strong> ${saldoTotal.toLocaleString()}
            </p>
          </div>
        </div>
        </div>
      
      </>
  )
}

export default Inicio;
