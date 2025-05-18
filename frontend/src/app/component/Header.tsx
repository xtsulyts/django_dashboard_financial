"use client"

import { FaShopify } from "react-icons/fa";
import { FcBullish, FcCurrencyExchange } from "react-icons/fc";
import { useRouter } from "next/navigation";

const Header = () => {
   const router = useRouter();

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo y nombre */}
        <div 
          className="flex items-center space-x-2 cursor-pointer" 
          onClick={() => router.push('/usuario')}
        >
          <FcBullish className="text-yellow-500 text-2xl dark:text-yellow-300" />
          <FcCurrencyExchange/>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">
            Tus Finanzas
          </h1>
        </div>

        {/* Botones */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push('/login')}
            className="px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors"
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => router.push('/')}
            className="px-3 py-1 text-sm font-medium bg-yellow-500 dark:bg-yellow-600 text-white rounded-md hover:bg-yellow-600 dark:hover:bg-yellow-700 transition-colors"
          >
            Registrarse
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;