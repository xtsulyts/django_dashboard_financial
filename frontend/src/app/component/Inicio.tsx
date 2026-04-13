"use client";

import FinanzasChart from "./FinanzasGraf";
import FinanzasMensualChart from "./FinanzasMensualChart";
import DonutCategoriasChart from "./DonutCategoriasChart";
import MercadoPagoSync from "./MercadoPagoSync";
import { useUser } from "../contex/UserContex";
import Image from 'next/image'


const Inicio = () => {

  const { totalIngresos, totalGastos, saldoTotal, user, fetchTotales } = useUser();

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
          <Image
            src={user?.avatar || `https://api.dicebear.com/9.x/shapes/svg?seed=${user?.user || 'default'}`}
            alt="Avatar"
            width={80}   // w-20 = 20 * 4 = 80px
            height={80}  // h-20 = 20 * 4 = 80px
            className="w-20 h-20 rounded-full border-4 border-blue-100 shadow-sm"
            unoptimized={true} // ← Para SVGs de Dicebear
          />
          <span className="text-yellow-900 dark:text-yellow-400 group-hover:underline ml-3"> {/* ← Añadí ml-3 para espaciado */}
            {user?.user || "Invitado"}
          </span>
        </h1>

          {/* Contenido de la card */}
          <div className="space-y-6">
            {/* Totales */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-green-100/60 rounded-xl p-3">
                <p className="text-sm text-gray-600">Ingresos</p>
                <p className="text-lg font-bold text-green-700">${totalIngresos.toLocaleString()}</p>
              </div>
              <div className="bg-red-100/60 rounded-xl p-3">
                <p className="text-sm text-gray-600">Gastos</p>
                <p className="text-lg font-bold text-red-700">${totalGastos.toLocaleString()}</p>
              </div>
              <div className="bg-blue-100/60 rounded-xl p-3">
                <p className="text-sm text-gray-600">Saldo</p>
                <p className="text-lg font-bold text-blue-700">${saldoTotal.toLocaleString()}</p>
              </div>
            </div>

            {/* Sync MercadoPago */}
            <MercadoPagoSync onSynced={fetchTotales} />

            {/* Gráfico de totales */}
            <FinanzasChart />

            {/* Gráfico de evolución mensual */}
            <FinanzasMensualChart />

            {/* Donut por categoría */}
            <DonutCategoriasChart />
          </div>
        </div>
      </div>

    </>
  )
}

export default Inicio;
