<<<<<<< HEAD
"use client"

import { FaShopify } from "react-icons/fa";
import { FcBullish, FcCurrencyExchange } from "react-icons/fc";
=======
"use client";

import { FcBullish } from "react-icons/fc";
>>>>>>> 8e30cb741938aff59055bbbe3ef82af3f82cab26
import { useRouter } from "next/navigation";
import { useUser } from "../contex/UserContex";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const Header = () => {
  const router = useRouter();
  const { user, logoutUser } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-600 shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo y nombre */}
        <div
          className="flex items-center space-x-2 cursor-pointer active:scale-95 hover:bg-yellow-500/10 px-3 py-1 rounded-full transition-all"
          onClick={() => router.push("/usuario")}
        >
<<<<<<< HEAD
          <FcBullish className="text-yellow-500 text-2xl dark:text-yellow-300" />
          <FcCurrencyExchange/>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">
=======
          <FcBullish className="text-3xl text-yellow-500 dark:text-yellow-300" />
          <h1 className="text-3xl font-bold text-white dark:text-white">
>>>>>>> 8e30cb741938aff59055bbbe3ef82af3f82cab26
            Tus Finanzas
          </h1>
        </div>
        {/* Botones */}
        <div>
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <div
                className="flex items-center cursor-pointer group"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <h1 className="text-2xl  text-gray-800 dark:text-white flex items-center">
                  Bienvenido,{" "}
                  <img
                    src={user.avatar || "/default-avatar.png"}
                    className="w-8 h-8 rounded-full mx-2 group-hover:ring-2 group-hover:ring-yellow-400 transition-all"
                    alt="Avatar"
                  />
                  <span className="text-yellow-500 dark:text-yellow-400 group-hover:underline">
                    {user.user}
                  </span>
                </h1>
              </div>

              {/* Menú desplegable */}
              {isDropdownOpen && (
             <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700">
  <Link href="/" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-yellow-500/10">
    Mi perfil
  </Link>
  <button
    onClick={logoutUser}
    className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-500/10"
  >
    Cerrar sesión
  </button>
</div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/login")}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors"
              >
                Iniciar Sesión
              </button>
                  <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/resgistro")}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors"
              >
                Registrate
              </button>
            </div>
            </div>
          )}
          
        </div>
      </div>
    </header>
  );
};

export default Header;
