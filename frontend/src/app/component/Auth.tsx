"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const AuthComponent = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    
    if (password !== confirmPassword) {
      setErrors({ confirmPassword: ["Las contraseñas no coinciden"] });
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await axios.post("http://localhost:8000/", {
        username,
        email,
        password1: password,
        password2: confirmPassword,
      });
      
      if (response.status === 201) {
        // Éxito - mostrar feedback y redirigir
        router.push("./login");
      }
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: ["Error en el registro. Revisa los datos."] });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Tarjeta con gradiente */}
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl overflow-hidden">
          {/* Header con gradiente */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-sm mb-4">
              <span className="text-3xl">🔐</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Crear Cuenta
            </h1>
            <p className="text-amber-100">
              Únete y toma el control de tus finanzas
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleRegister} className="p-8">
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <p className="text-red-700 dark:text-red-400 text-sm font-medium">
                  ⚠️ {errors.general[0]}
                </p>
              </div>
            )}

            <div className="space-y-6">
              {[
                {
                  label: "Nombre de usuario",
                  value: username,
                  setValue: setUsername,
                  error: errors.username,
                  placeholder: "juanperez",
                  icon: "👤",
                  type: "text"
                },
                {
                  label: "Correo electrónico",
                  value: email,
                  setValue: setEmail,
                  error: errors.email,
                  placeholder: "tu@email.com",
                  icon: "📧",
                  type: "email"
                },
                {
                  label: "Contraseña",
                  value: password,
                  setValue: setPassword,
                  error: errors.password1,
                  placeholder: "••••••••",
                  icon: "🔒",
                  type: "password"
                },
                {
                  label: "Confirmar contraseña",
                  value: confirmPassword,
                  setValue: setConfirmPassword,
                  error: errors.confirmPassword || errors.password2,
                  placeholder: "••••••••",
                  icon: "✅",
                  type: "password"
                },
              ].map((field, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {field.label}
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      {field.icon}
                    </div>
                    <input
                      type={field.type}
                      value={field.value}
                      onChange={(e) => field.setValue(e.target.value)}
                      className={`w-full pl-12 pr-4 py-3.5 bg-white dark:bg-gray-800 border ${
                        field.error 
                          ? "border-red-500 focus:border-red-500 ring-red-500/20" 
                          : "border-gray-300 dark:border-gray-700 focus:border-amber-500"
                      } rounded-xl focus:ring-4 focus:ring-amber-500/20 transition-all outline-none`}
                      placeholder={field.placeholder}
                      required
                    />
                  </div>
                  {field.error && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {field.error[0]}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Términos y condiciones */}
            <div className="mt-8 flex items-start space-x-3">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400">
                Acepto los{' '}
                <a href="#" className="text-amber-600 dark:text-amber-400 hover:underline font-medium">
                  Términos de Servicio
                </a>{' '}
                y la{' '}
                <a href="#" className="text-amber-600 dark:text-amber-400 hover:underline font-medium">
                  Política de Privacidad
                </a>
              </label>
            </div>

            {/* Botón de registro */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full mt-8 py-4 px-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                  Creando cuenta...
                </div>
              ) : (
                <>
                  <span className="text-lg mr-2">🚀</span>
                  Crear mi cuenta
                </>
              )}
            </button>

            {/* Enlace a login */}
            <div className="mt-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                ¿Ya tienes una cuenta?{' '}
                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="text-amber-600 dark:text-amber-400 font-semibold hover:underline"
                >
                  Inicia sesión aquí
                </button>
              </p>
            </div>

            {/* Separador */}
            <div className="mt-8 flex items-center">
              <div className="flex-1 border-t border-gray-300 dark:border-gray-700"></div>
              <span className="mx-4 text-sm text-gray-500 dark:text-gray-400">O continúa con</span>
              <div className="flex-1 border-t border-gray-300 dark:border-gray-700"></div>
            </div>

            {/* Botones sociales */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center py-3 px-4 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <span className="mr-2">🔵</span>
                <span className="text-sm font-medium">Google</span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center py-3 px-4 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <span className="mr-2">⚫</span>
                <span className="text-sm font-medium">GitHub</span>
              </button>
            </div>
          </form>

          {/* Footer de la tarjeta */}
          <div className="bg-gray-50 dark:bg-gray-900/50 p-6 text-center border-t border-gray-200 dark:border-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Al registrarte, aceptas nuestros términos y confirmas que has leído nuestra política de privacidad.
              <br />
              <span className="text-amber-600 dark:text-amber-400">•</span> Protegemos tus datos financieros
            </p>
          </div>
        </div>

        {/* Enlace de ayuda */}
        <div className="mt-6 text-center">
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthComponent;