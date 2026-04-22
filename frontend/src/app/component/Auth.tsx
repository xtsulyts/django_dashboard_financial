"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { AlertTriangle, User, Mail, Lock, CheckCircle, ArrowRight, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

function TermsCheckbox() {
  const [checked, setChecked] = useState(false);
  return (
    <div className="flex items-start gap-3 pt-1">
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={() => setChecked((v) => !v)}
        className={`mt-0.5 w-4 h-4 shrink-0 rounded border flex items-center justify-center transition-colors ${
          checked ? "bg-amber-500 border-amber-500" : "bg-white border-slate-300"
        }`}
      >
        {checked && (
          <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none">
            <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
      {/* hidden input real para que el form lo valide */}
      <input type="checkbox" checked={checked} onChange={() => {}} className="sr-only" required />
      <label className="text-sm text-slate-500 cursor-pointer" onClick={() => setChecked((v) => !v)}>
        Acepto los{" "}
        <a href="#" className="text-amber-600 hover:underline font-medium" onClick={(e) => e.stopPropagation()}>
          Términos de Servicio
        </a>{" "}
        y la{" "}
        <a href="#" className="text-amber-600 hover:underline font-medium" onClick={(e) => e.stopPropagation()}>
          Política de Privacidad
        </a>
      </label>
    </div>
  );
}

const AuthComponent = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
        toast.success("¡Cuenta creada!", { description: "Ya podés iniciar sesión con tus credenciales." });
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
            Comenzá a controlar{" "}
            <span className="text-emerald-400">tus finanzas hoy</span>
          </h2>
          <p className="text-slate-400 text-lg mb-10">
            Creá tu cuenta y accedé a tu panel financiero personal en segundos.
          </p>

          <ul className="space-y-4">
            {[
              { text: "Reportes visuales de tus finanzas" },
              { text: "Seguimiento de ingresos y gastos" },
              { text: "Control total de tus transacciones" },
              { text: "Datos seguros y siempre disponibles" },
            ].map(({ text }) => (
              <li key={text} className="flex items-center gap-3 text-slate-300">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-3 h-3 text-emerald-400" />
                </div>
                <span className="text-sm">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-slate-600 text-sm">© 2026 FinanzasCtrl</p>
      </div>

      {/* Panel derecho — formulario */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center overflow-y-auto py-8 px-8">
        <div className="w-full max-w-md">
          {/* Logo mobile */}
          <div className="flex items-center gap-2 mb-6 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-base">$</span>
            </div>
            <span className="font-semibold text-slate-800 tracking-tight">
              Finanzas<span className="text-amber-600">Ctrl</span>
            </span>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-2">Crear cuenta</h1>
          <p className="text-slate-500 mb-6">
            ¿Ya tenés cuenta?{" "}
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="text-amber-600 hover:underline font-medium"
            >
              Iniciá sesión aquí
            </button>
          </p>

          {errors.general && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" /> {errors.general[0]}
              </p>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            {[
              {
                label: "Nombre de usuario",
                value: username,
                setValue: setUsername,
                error: errors.username,
                placeholder: "tu nombre",
                icon: User,
                type: "text",
                toggleShow: null,
                show: null,
              },
              {
                label: "Correo electrónico",
                value: email,
                setValue: setEmail,
                error: errors.email,
                placeholder: "tu@email.com",
                icon: Mail,
                type: "email",
                toggleShow: null,
                show: null,
              },
              {
                label: "Contraseña",
                value: password,
                setValue: setPassword,
                error: errors.password1,
                placeholder: "••••••••",
                icon: Lock,
                type: "password",
                toggleShow: () => setShowPassword((v) => !v),
                show: showPassword,
              },
              {
                label: "Confirmar contraseña",
                value: confirmPassword,
                setValue: setConfirmPassword,
                error: errors.confirmPassword || errors.password2,
                placeholder: "••••••••",
                icon: CheckCircle,
                type: "password",
                toggleShow: () => setShowConfirmPassword((v) => !v),
                show: showConfirmPassword,
              },
            ].map((field, index) => (
              <div key={index}>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  {field.label}
                </label>
                <div className="relative">
                  <field.icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={field.toggleShow ? (field.show ? "text" : "password") : field.type}
                    value={field.value}
                    onChange={(e) => field.setValue(e.target.value)}
                    placeholder={field.placeholder}
                    className={`w-full pl-10 ${field.toggleShow ? "pr-11" : "pr-4"} py-3 bg-white border rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 transition-all ${
                      field.error
                        ? "border-red-400 focus:border-red-400 focus:ring-red-500/10"
                        : "border-slate-200 focus:border-amber-500 focus:ring-amber-500/10"
                    }`}
                    required
                  />
                  {field.toggleShow && (
                    <button
                      type="button"
                      onClick={field.toggleShow}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      aria-label={field.show ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      {field.show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  )}
                </div>
                {field.error && (
                  <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    {field.error[0]}
                  </p>
                )}
              </div>
            ))}

            {/* Términos */}
            <TermsCheckbox />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-3 rounded-xl font-medium text-base transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creando cuenta...
                </>
              ) : (
                <>
                  <ArrowRight className="w-4 h-4" />
                  Crear mi cuenta
                </>
              )}
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 border-t border-slate-200" />
              <span className="text-sm text-slate-400">O continúa con</span>
              <div className="flex-1 border-t border-slate-200" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center gap-2 py-2.5 px-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 py-2.5 px-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/></svg>
                GitHub
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthComponent;