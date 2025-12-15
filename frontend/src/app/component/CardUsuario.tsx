// CardUsuario.tsx
"use client";

import { useUser } from "../contex/UserContex";
import { useRouter } from "next/navigation";
import FinanzasChart from "./FinanzasGraf";
import { useEffect, useState } from "react";
import Image from 'next/image'; // ← AÑADE ESTE IMPORT

// Tipo para el usuario (ajusta según tu implementación real)
type UserType = {
  username: string;
  avatar?: string;
  user?: string;
  // ... otras propiedades
};

//Define el tipo para las props
interface CardUsuarioProps {
  onUpdateUser?: (user: UserType) => void; // Prop opcional para actualizar usuario
}

const CardUsuario: React.FC<CardUsuarioProps> = ({ onUpdateUser }) => {
  const [usuarioLogueado, setUsuarioLogueado] = useState<string>("");
  const router = useRouter();
  const { user, totalIngresos, totalGastos, saldoTotal } = useUser(); // Obtiene user del contexto

  // Actualiza el estado local y notifica al padre cuando cambia el usuario
  useEffect(() => {
    if (user) {
      setUsuarioLogueado(user.user || ""); // ← Añade || "" para seguridad
    }
  }, [user, onUpdateUser]); // Se ejecuta cuando cambia user o la prop

  const handleIngresos = () => {
    router.push("/transacciones");
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/yourFinancialPhotoInicio.webp')" }} // Fondo con imagen
    >
      <div className="relative bg-white/30 backdrop-blur-md rounded-lg shadow-lg p-8 max-w-2xl w-full my-8">
        {/* Avatar y bienvenida */}
        <div className="flex flex-col items-center">
          {/* REEMPLAZA <img> por <Image /> */}
          <Image
            src={user?.avatar || `https://api.dicebear.com/9.x/shapes/svg?seed=${user?.user || 'default'}`}
            alt="Avatar"
            width={80}  // w-20 = 20 * 4 = 80px
            height={80} // h-20 = 20 * 4 = 80px
            className="w-20 h-20 rounded-full border-4 border-blue-100 shadow-sm"
            unoptimized={true} // ← IMPORTANTE para SVGs de Dicebear
          />
          <h2 className="text-2xl font-bold mt-4 text-gray-800">
            Bienvenido, {usuarioLogueado || "Invitado"} {/* ← Añadí fallback */}
          </h2>
          <p className="text-gray-600 mb-8 mt-2">
            {user
              ? "Gracias por ser parte de nuestra comunidad."
              : "Inicia sesión para acceder a más funcionalidades."}
          </p>
        </div>

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
    </div>
  );
};

export default CardUsuario;