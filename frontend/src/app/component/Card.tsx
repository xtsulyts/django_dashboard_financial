// Card.tsx
"use client"; // Esto es necesario para componentes de cliente en Next.js

import { useUser } from "../contex/UserContex";

const Card = () => {
  const { user } = useUser();
  console.log("user:", user)

  return (
    <div className="flex justify-center py-10">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">Bienvenido, {user?.user}</h2>
        <p className="text-gray-700 mb-6">
          Esta es una tarjeta de ejemplo que puedes usar entre el header y el footer.
        </p>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          Acción
        </button>
      </div>
    </div>
  );
};

export default Card;
