// Card.tsx
"use client"; // Esto indica que el componente debe renderizarse en el cliente en Next.js

import { useUser } from "../contex/UserContex"; // Importa el hook personalizado para acceder al contexto de usuario
import { useRouter } from "next/navigation"; // Importa useRouter para manejar redirecciones
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';

const Card = () => {
  // Obtiene el usuario y la función de logout desde el contexto
  const { user, logoutUser } = useUser();
  const router = useRouter(); // Hook de Next.js para redirección
  

  // Función que maneja el logout
  const handleLogout = () => {
    logoutUser(); // Llama a la función de logout para eliminar la sesión del usuario
    router.push("./"); // Redirige al usuario a la página de login después de cerrar sesión
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-99">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full text-center">
        {/* Contenedor del avatar y nombre de usuario */}
        <div className="mb-6">
          <div className="flex justify-center">
            <img
              src={user?.avatar || "https://api.dicebear.com/9.x/pixel-art/svg"}
              alt="Avatar"
              className="w-20 h-20 rounded-full border-4 border-blue-100 shadow-sm"
            />
          </div>
          <h2 className="text-2xl font-bold mt-4 text-gray-800">
            Bienvenido, {user?.user || "Invitado"}
          </h2>
        </div>
  
        {/* Mensaje adicional */}
        <p className="text-gray-600 mb-8">
          {user
            ? "Gracias por ser parte de nuestra comunidad."
            : "Inicia sesión para acceder a más funcionalidades."}
        </p>
  
        {/* Botón de cerrar sesión (solo visible si hay un usuario logueado) */}
        {user && (
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition duration-300"
          >
            Cerrar sesión
          </button>
        )}
      </div>
    </div>
  );
};

export default Card;
