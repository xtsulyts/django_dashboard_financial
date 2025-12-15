"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../contex/UserContex";
// Comentamos temporalmente Google para el despliegue
// import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

function LoginFormulario() {
  const { loginUser } = useUser();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  // CORRECCIÓN 1: Tipo específico para el evento del formulario
  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    try {
      await loginUser(email, password);
      router.push("./usuario");
    } catch (err: unknown) {
      // CORRECCIÓN 2: Manejo seguro de errores
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error desconocido");
      }
    }
  };

  
  /*
  interface GoogleCredentialResponse {
    credential: string;
  }

  const handleGoogleSuccess = async (credentialResponse: GoogleCredentialResponse) => {
    try {
      // Envía el token de Google a tu backend
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: credentialResponse.credential })
      });

      const data = await response.json();
      
      if (response.ok) {
        // Asume que tu backend devuelve los datos del usuario
        await loginUser(data.user.email, '', true);
        router.push("./");
      } else {
        throw new Error(data.message || 'Error en autenticación con Google');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error en autenticación con Google');
      }
    }
  };
  */

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/yourFinancialPhotoInicio.webp')" }}
    >
      {/* Overlay con opacidad */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/10 backdrop-blur-[1px]"></div>
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Tarjeta del formulario con tus estilos */}
          <div className="bg-gradient-to-br from-white/95 via-white/90 to-white/95 dark:from-gray-800/95 dark:via-gray-800/90 dark:to-gray-800/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/40 dark:border-gray-700/40">
            
            {/* Header con gradiente */}
            <div className="bg-gradient-to-r from-emerald-500/90 to-cyan-500/90 p-8">
              <div className="flex flex-col items-center">
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Inicia Sesión
                </h1>
                <p className="text-emerald-100 text-center">
                  Accede a tu panel de finanzas personales
                </p>
              </div>
            </div>

            {/* Formulario */}
            <form onSubmit={handleLogin} className="p-6 md:p-8">
              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <p className="text-red-700 dark:text-red-400 font-medium flex items-center">
                    <span className="mr-2">⚠️</span>
                    {error}
                  </p>
                </div>
              )}

              {/* Campo Email */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  <span className="flex items-center">
                    <span className="mr-2">📧</span>
                    Correo Electrónico
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="tucorreo@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all outline-none text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
                    required
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                    @
                  </div>
                </div>
              </div>

              {/* Campo Contraseña */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  <span className="flex items-center">
                    <span className="mr-2">🔒</span>
                    Contraseña
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all outline-none text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
                    required
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                    🔐
                  </div>
                </div>
              </div>

              {/* Botón de Login */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white py-3.5 rounded-xl hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300 font-medium text-lg shadow-lg hover:shadow-emerald-500/25 mb-4"
              >
                Iniciar Sesión
              </button>

              {/* Separador */}
              <div className="flex items-center my-6">
                <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
                <span className="mx-4 text-gray-500 dark:text-gray-400">o continúa con</span>
                <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
              </div>

              {/* Sección de Google (comentada temporalmente) */}
              <div className="text-center text-gray-500 dark:text-gray-400 mb-4">
                <p className="text-sm">
                  {/* Google Login temporalmente deshabilitado para despliegue */}
                  Opciones sociales disponibles próximamente
                </p>
              </div>
            
              {/*
              <GoogleOAuthProvider clientId="TU_CLIENT_ID_AQUI">
                <div className="flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => {
                      setError('Falló el inicio de sesión con Google');
                    }}
                    size="large"
                    text="continue_with"
                    shape="rectangular"
                    theme="outline"
                  />
                </div>
              </GoogleOAuthProvider>
              */}
              
              {/* Enlace de registro (si lo agregas luego) */}
              <div className="text-center mt-6">
                <p className="text-gray-600 dark:text-gray-300">
                  ¿No tienes cuenta?{" "}
                  <button
                    type="button"
                    onClick={() => router.push("/registro")}
                    className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                  >
                    Regístrate aquí
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginFormulario;