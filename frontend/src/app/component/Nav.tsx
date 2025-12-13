"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Nav() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const menuItems = [
    { label: "Inicio", path: "/", icon: "🏠" },
    { label: "Dashboard", path: "/usuario", icon: "📊" },
    { label: "Transacciones", path: "/transacciones", icon: "💳" },
    { label: "Movimientos", path: "/movimientos", icon: "📈" },
  ];

  return (
    <nav className="sticky top-16 z-40 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-b border-gray-200/50 dark:border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-xl hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm transition-all duration-200 group relative"
              >
                <span className="mr-2.5 text-lg group-hover:scale-110 transition-transform">
                  {item.icon}
                </span>
                <span className="font-medium">{item.label}</span>
                <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-amber-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow transition-all"
            aria-label="Toggle menu"
          >
            <div className="relative w-5 h-5">
              <span className={`absolute top-1 w-full h-0.5 bg-gray-600 dark:bg-gray-300 rounded-full transition-all ${isMenuOpen ? 'rotate-45 top-2' : ''}`}></span>
              <span className={`absolute top-2 w-full h-0.5 bg-gray-600 dark:bg-gray-300 rounded-full transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`absolute top-3 w-full h-0.5 bg-gray-600 dark:bg-gray-300 rounded-full transition-all ${isMenuOpen ? '-rotate-45 top-2' : ''}`}></span>
            </div>
          </button>

          {/* Mobile Menu Overlay */}
          {isMenuOpen && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-40 md:hidden"
                onClick={() => setIsMenuOpen(false)}
              />
              
              {/* Menu Panel */}
              <div className="fixed top-28 right-4 left-4 md:hidden bg-white dark:bg-gray-800 rounded-2xl shadow-xl z-50 overflow-hidden animate-in slide-in-from-top-5 duration-300">
                <div className="p-2">
                  {menuItems.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => {
                        router.push(item.path);
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-3.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group/mobile"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center mr-3 group-hover/mobile:from-amber-50 group-hover/mobile:to-orange-50 dark:group-hover/mobile:from-amber-900/20 dark:group-hover/mobile:to-orange-900/20 transition-all">
                        <span className="text-xl">{item.icon}</span>
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {item.label}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {item.path === "/" && "Página principal"}
                          {item.path === "/usuario" && "Resumen financiero"}
                          {item.path === "/transacciones" && "Agregar transacciones"}
                          {item.path === "/movimientos" && "Historial completo"}
                        </div>
                      </div>
                      <svg className="w-5 h-5 text-gray-400 group-hover/mobile:text-amber-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ))}
                </div>
                
                {/* Close button */}
                <div className="border-t border-gray-100 dark:border-gray-700 p-4">
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full py-3 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors"
                  >
                    Cerrar menú
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Desktop Right Side - Optional CTA */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={() => router.push("/reportes")}
              className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 hover:bg-white dark:hover:bg-gray-800 rounded-xl transition-colors"
            >
              📄 Reportes
            </button>
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-700"></div>
            <button
              onClick={() => router.push("/ayuda")}
              className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 hover:bg-white dark:hover:bg-gray-800 rounded-xl transition-colors"
            >
              ❓ Ayuda
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}