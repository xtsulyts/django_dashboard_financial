"use client"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "../contex/UserContex";
import { useState, useEffect, useRef } from "react";

const Header = () => {
  const router = useRouter();
  const { user, logoutUser } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null); // ← Añade el tipo
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => { // ← Añade : MouseEvent
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) { // ← Añade as Node
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Minimalista */}
          <button
            onClick={() => router.push("/usuario")}
            className="flex items-center group"
            aria-label="Ir al inicio"
          >
            <div className="relative">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300">
                <span className="text-white font-bold text-lg tracking-tight">$</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-900"></div>
            </div>
            <div className="ml-3 flex flex-col items-start">
              <span className="font-bold text-gray-900 dark:text-white text-lg sm:text-xl tracking-tight">
                Finanzas<span className="text-amber-600 dark:text-amber-500">Pro</span>
              </span>
              <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wide">
                Control total de tu dinero
              </span>
            </div>
          </button>

          {/* Menú - Derecha */}
          <div className="flex items-center">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                {/* Botón usuario logueado */}
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 group"
                  aria-label="Menú de usuario"
                >
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200 leading-tight">
                      {user.user}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Gestionando finanzas
                    </span>
                  </div>
                  <div className="relative">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 border-transparent group-hover:border-amber-500/30 transition-all duration-300">
                    <img
                      src={user?.avatar || `https://api.dicebear.com/9.x/shapes/svg?seed=${user?.user}`}
                      alt={user.user}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement; // ← Type assertion
                        target.src = "/default-avatar.png";
                      }}
                    />
                                        </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-500 to-green-400 rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Dropdown - Mejorado */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-2xl shadow-xl ring-1 ring-black/10 dark:ring-white/10 overflow-hidden animate-in fade-in slide-in-from-top-3 duration-200">
                    {/* Header del dropdown */}
                    <div className="p-5 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-b border-gray-200/50 dark:border-gray-700/50">
                      <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white dark:border-gray-700 shadow">
                          <img
                            src={user.avatar || "/default-avatar.png"}
                            className="w-full h-full object-cover"
                            alt={user.user}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 dark:text-white truncate">{user.user}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                            {user.email || "Usuario premium"}
                          </p>
                          <div className="flex items-center mt-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1"></div>
                              Activo
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Opciones del menú */}
                    <div className="p-2">
                      <Link
                        href="/dashboard"
                        className="flex items-center px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group/menu"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3 group-hover/menu:bg-blue-500/20 transition-colors">
                          <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">Dashboard</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Resumen financiero</div>
                        </div>
                      </Link>

                      <Link
                        href="/perfil"
                        className="flex items-center px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group/menu"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-3 group-hover/menu:bg-purple-500/20 transition-colors">
                          <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">Mi perfil</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Editar información</div>
                        </div>
                      </Link>

                      <Link
                        href="/configuracion"
                        className="flex items-center px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group/menu"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3 group-hover/menu:bg-gray-200 dark:group-hover/menu:bg-gray-600 transition-colors">
                          <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">Configuración</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Preferencias</div>
                        </div>
                      </Link>
                    </div>

                    {/* Separador */}
                    <div className="border-t border-gray-200 dark:border-gray-700 mx-4"></div>

                    {/* Logout */}
                    <div className="p-4">
                      <button
                        onClick={() => {
                          logoutUser();
                          setIsDropdownOpen(false);
                          router.push("/");
                        }}
                        className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 rounded-xl shadow-sm hover:shadow transition-all duration-200 group/logout"
                      >
                        <svg className="w-4 h-4 mr-2 group-hover/logout:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Usuario no autenticado
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => router.push("/login")}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors duration-200"
                >
                  Iniciar sesión
                </button>
                <button
                  onClick={() => router.push("/registro")}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  Crear cuenta
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;