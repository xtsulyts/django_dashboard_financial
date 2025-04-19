// Card.tsx
"use client"; // Esto indica que el componente debe renderizarse en el cliente en Next.js

import { useUser } from "../contex/UserContex"; // Importa el hook personalizado para acceder al contexto de usuario
import { useRouter } from "next/navigation"; // Importa useRouter para manejar redirecciones
import FinanzasChart from "./FinanzasGraf";

const CardUsuario = () => {
  // Obtiene el usuario y la función de logout desde el contexto
  const { user, setUser } = useUser();
  const router = useRouter(); // Hook de Next.js para redirección
  const { totalIngresos, totalGastos, saldoTotal } = useUser();



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
    <div className="mb-6">
      {/* Logo */}
      <div className="flex justify-center">
        <img
          src={user?.avatar || `https://api.dicebear.com/9.x/shapes/svg?seed=${user?.username}`}
          alt="Avatar"
          className="w-40 h-40 rounded-full border-4 border-blue-100 shadow-sm"
        />
      </div>
      <h2 className="text-2xl font-bold mt-4 text-gray-800">
        Bienvenido, {user?.user || "Invitado"}
      </h2>
    </div>
    <p className="text-gray-600 mb-8">
      {user
        ? "Gracias por ser parte de nuestra comunidad."
        : "Inicia sesión para acceder a más funcionalidades."}
    </p>

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
