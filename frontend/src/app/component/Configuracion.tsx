"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun, Monitor, Bell, Globe, Lock } from "lucide-react";

const Configuracion = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const temas = [
    { value: "light",  label: "Claro",    icon: Sun     },
    { value: "dark",   label: "Oscuro",   icon: Moon    },
    { value: "system", label: "Sistema",  icon: Monitor },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center py-10 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 max-w-md w-full space-y-6">

        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Configuración</h2>

        {/* Tema */}
        <div>
          <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-3">Apariencia</p>
          {mounted && (
            <div className="grid grid-cols-3 gap-3">
              {temas.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setTheme(value)}
                  className={`flex flex-col items-center gap-2 py-4 rounded-xl border-2 transition-all text-sm font-medium ${
                    theme === value
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                      : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Otras opciones — placeholders para MVP */}
        <div>
          <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-3">Preferencias</p>
          <div className="space-y-2">
            {[
              { icon: Bell,   label: "Notificaciones",  desc: "Próximamente" },
              { icon: Globe,  label: "Idioma",           desc: "Español"      },
              { icon: Lock,   label: "Privacidad",       desc: "Próximamente" },
            ].map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="flex items-center gap-4 bg-slate-50 dark:bg-gray-700/50 rounded-xl px-4 py-3"
              >
                <div className="w-8 h-8 rounded-lg bg-white dark:bg-gray-600 flex items-center justify-center shadow-sm shrink-0">
                  <Icon className="w-4 h-4 text-gray-500 dark:text-gray-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{label}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Configuracion;
