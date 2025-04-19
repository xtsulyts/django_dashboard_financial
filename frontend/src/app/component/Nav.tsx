"use client";

//import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaShopify, FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";


export default function Nav() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const menuItems = [
    { label: "Home", path: "/" },
    { label: "Usuario", path: "/usuario" },
    { label: "Transacciones", path: "/transacciones" },
    { label: "Movimientos", path: "/movimientos" },
  ];


  return (
    <>

    <header className="bg-gray-800 text-white py-4 px-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo y nombre */}
        <div 
          className="flex items-center space-x-2 cursor-pointer" 
          onClick={() => router.push('/')}
        >
          <FaShopify className="text-yellow-500 text-2xl" />
          <h1 className="text-xl font-bold text-white">TUS FINANZAS</h1>
        </div>

        {/* Menú para pantallas grandes (md en adelante) */}
        <nav className="hidden md:flex gap-6">
          {menuItems.map((item) => (
            <button
              key={item.path}
              className="flex items-center gap-2 hover:underline hover:underline-offset-4"
              onClick={() => router.push(item.path)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Botón hamburguesa para móviles */}
        <button 
          className="md:hidden text-white focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Menú móvil */}
      {isMenuOpen && (
        <nav className="md:hidden bg-gray-700 mt-2 py-2 px-4 rounded-lg">
          <div className="flex flex-col gap-4">
            {menuItems.map((item) => (
              <button
                key={item.path}
                className="flex items-center gap-2 py-2 hover:underline hover:underline-offset-4"
                onClick={() => {
                  router.push(item.path);
                  setIsMenuOpen(true);
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </nav>
      )}
    </header>
    </>
  );
}
