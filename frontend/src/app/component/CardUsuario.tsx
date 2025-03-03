// Card.tsx
"use client"; // Esto indica que el componente debe renderizarse en el cliente en Next.js

import { useUser } from "../contex/UserContex"; // Importa el hook personalizado para acceder al contexto de usuario
import { useRouter } from "next/navigation"; // Importa useRouter para manejar redirecciones

const CardUsuario = () => {
  // Obtiene el usuario y la función de logout desde el contexto
  const { user, logoutUser } = useUser();
  const router = useRouter(); // Hook de Next.js para redirección


  // Función que maneja el logout
  const handleLogout = () => {
    logoutUser(); // Llama a la función de logout para eliminar la sesión del usuario
    router.push("./"); // Redirige al usuario a la página de login después de cerrar sesión
  };

  const handleIngresos = () => {
    router.push("/transacciones") // Usa una ruta absoluta
      console.log("Navegación exitosa"); // Manejo opcional de éxito
      //console.error("Error al navegar:", Error); // Manejo de errores
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4 gap-4">

       {/* Logo */}
       <div className="mb-8">
        <video
          src="/Main Scene.webm"
          autoPlay
          loop
          muted
          className="w-130 h-100 mx-auto"
        />
      </div>
      
    {/* CardUsuario */}
    <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full text-center">
      <div className="mb-6">
        <div className="flex justify-center">
          <img
            src={user?.avatar}
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
      {user && (

        
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition duration-300"
        >
          Cerrar sesión
        </button>
      )}
    </div>
  
    {/* CardIngresos */}
    <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full text-center">
      <h1>TUS INGRESOS</h1>
      <button
          onClick={handleIngresos}
          className="w-full bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition duration-300"
        >
          transacciones
        </button>
    </div>
  
    {/* CardEgresos */}
    <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full text-center">
      <h1>TUS EGRESOS SON:</h1>
    </div>

    <h1>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Consequuntur ipsa, neque vitae iste veniam facilis nisi voluptatum, cumque nihil laborum autem dignissimos nesciunt nobis. Temporibus praesentium commodi animi assumenda modi.</h1>
  </div>
  );
};

export default CardUsuario;
