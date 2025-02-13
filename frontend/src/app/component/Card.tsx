// Card.tsx
"use client"; // Esto es necesario para componentes de cliente en Next.js

import React from 'react';

const Card = () => {
  return (
    <div className="flex justify-center py-10">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">Tarjeta de Ejemplo</h2>
        <p className="text-gray-700 mb-6">
          Esta es una tarjeta de ejemplo que puedes usar entre el header y el footer. ¡Puedes agregar más contenido aquí!
        </p>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
          Acción
        </button>
      </div>
    </div>
  );
};

export default Card;
