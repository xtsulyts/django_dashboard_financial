"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../contex/UserContex";
import { AlertTriangle, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

function LoginFormulario() {
  const { loginUser } = useUser();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await loginUser(email, password);
      toast.success("¡Bienvenido de vuelta!", { description: "Sesión iniciada correctamente." });
      router.push("./usuario");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error desconocido");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">

          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 p-8 text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Inicia Sesión</h1>
            <p className="text-emerald-100">Accede a tu panel de finanzas personales</p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleLogin} className="p-6 md:p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <p className="text-red-700 dark:text-red-400 font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  {error}
                </p>
              </div>
            )}

            {/* Email */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                <span className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Correo Electrónico
                </span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  placeholder="tucorreo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all outline-none text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  required
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                <span className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Contraseña
                </span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all outline-none text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white py-3.5 rounded-xl hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300 font-medium text-lg shadow-lg mb-4 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </button>

            <div className="text-center mt-6">
              <p className="text-gray-600 dark:text-gray-400">
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
  );
}

export default LoginFormulario;
