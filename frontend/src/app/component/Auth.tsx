"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { AlertTriangle, User, Mail, Lock, CheckCircle, ArrowRight } from "lucide-react";

const AuthComponent = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setErrors({});
    
    if (password !== confirmPassword) {
      setErrors({ confirmPassword: ["Las contraseñas no coinciden"] });
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/`, {
        username,
        email,
        password1: password,
        password2: confirmPassword,
      });
      
      if (response.status === 201) {
        // Éxito - mostrar feedback y redirigir
        router.push("/login");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: ["Error en el registro. Revisa los datos."] });
      }
      if (axios.isAxiosError(error)) console.error("Error en registro:", error.response?.data);
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
              <Lock className="w-8 h-8 text-white" />
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
                  <AlertTriangle className="w-4 h-4 shrink-0 inline mr-1" /> {errors.general[0]}
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
                  placeholder: "tu nombre",
                  icon: User,
                  type: "text"
                },
                {
                  label: "Correo electrónico",
                  value: email,
                  setValue: setEmail,
                  error: errors.email,
                  placeholder: "tu@email.com",
                  icon: Mail,
                  type: "email"
                },
                {
                  label: "Contraseña",
                  value: password,
                  setValue: setPassword,
                  error: errors.password1,
                  placeholder: "••••••••",
                  icon: Lock,
                  type: "password"
                },
                {
                  label: "Confirmar contraseña",
                  value: confirmPassword,
                  setValue: setConfirmPassword,
                  error: errors.confirmPassword || errors.password2,
                  placeholder: "••••••••",
                  icon: CheckCircle,
                  type: "password"
                },
              ].map((field, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {field.label}
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <field.icon className="w-4 h-4" />
                    </div>
                    <input
                      type={field.type}
                      value={field.value}
                      onChange={(e) => field.setValue(e.target.value)}
                      className={`w-full pl-12 pr-4 py-3.5 bg-white dark:bg-gray-800 border ${
                        field.error 
                          ? "border-red-500 focus:border-red-500 ring-red-500/20" 
                          : "border-gray-300 dark:border-gray-700 focus:border-amber-500"
                      } rounded-xl focus:ring-4 focus:ring-amber-500/20 transition-all outline-none text-gray-600 dark:text-gray-300 placeholder:text-gray-400 dark:placeholder:text-gray-500`}
                      placeholder={field.placeholder}
                      required
                    />
                  </div>
                  {field.error && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
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
                <span className="flex items-center justify-center gap-2">
                  <ArrowRight className="w-4 h-4" />
                  Crear mi cuenta
                </span>
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
                className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                <span className="text-sm font-medium">Google</span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/></svg>
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