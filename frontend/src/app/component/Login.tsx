"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../contex/UserContex";
import {
  AlertTriangle,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  BarChart2,
  ShieldCheck,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";

const features = [
  { icon: BarChart2, text: "Reportes visuales de tus finanzas" },
  { icon: TrendingUp, text: "Seguimiento de ingresos y gastos" },
  { icon: Wallet, text: "Control total de tus transacciones" },
  { icon: ShieldCheck, text: "Datos seguros y siempre disponibles" },
];

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
    <div className="fixed inset-0 z-50 flex">
      {/* Panel izquierdo — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 flex-col justify-between p-12">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-lg">$</span>
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">
            Finanzas<span className="text-amber-400">Ctrl</span>
          </span>
        </div>

        {/* Headline */}
        <div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Tu control financiero,{" "}
            <span className="text-emerald-400">siempre disponible</span>
          </h2>
          <p className="text-slate-400 text-lg mb-10">
            Iniciá sesión para acceder a tu panel, ver reportes y gestionar tus finanzas personales.
          </p>

          <ul className="space-y-4">
            {features.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-slate-300">
                <div className="w-8 h-8 rounded-md bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-sm">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-slate-600 text-sm">© 2026 FinanzasCtrl</p>
      </div>

      {/* Panel derecho — formulario */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo mobile */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-base">$</span>
            </div>
            <span className="font-semibold text-slate-800 tracking-tight">
              Finanzas<span className="text-amber-600">Ctrl</span>
            </span>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-2">Iniciar sesión</h1>
          <p className="text-slate-500 mb-2">
            ¿No tenés cuenta?{" "}
            <button
              type="button"
              onClick={() => router.push("/registro")}
              className="text-emerald-600 hover:underline font-medium"
            >
              Registrate aquí
            </button>
          </p>

          {error && (
            <div className="mt-4 mb-2 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  placeholder="ejemplo@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                  required
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white py-3 rounded-xl font-medium text-base transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                "Ingresar"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginFormulario;
