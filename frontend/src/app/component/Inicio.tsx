"use client";

import { Suspense } from "react";
import MercadoPagoSync from "./MercadoPagoSync";
import DolarWidget from "./DolarWidget";
import { useUser } from "../contex/UserContex";
import Image from "next/image";
import { TrendingUp, TrendingDown } from "lucide-react";

function formatCompact(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(abs % 1_000_000 === 0 ? 0 : 1)}M`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(abs % 1_000 === 0 ? 0 : 1)}k`;
  return `${sign}$${abs.toLocaleString()}`;
}

function saludo() {
  const h = new Date().getHours();
  if (h < 12) return "Buenos días";
  if (h < 19) return "Buenas tardes";
  return "Buenas noches";
}

const Inicio = () => {
  const { totalIngresos, totalGastos, saldoTotal, user, fetchTotales } = useUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Hero: saludo + saldo */}
        <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Image
                src={user?.avatar || `https://api.dicebear.com/9.x/shapes/svg?seed=${user?.user || "default"}`}
                alt="Avatar"
                width={44}
                height={44}
                className="w-11 h-11 rounded-full border-2 border-white/40"
                unoptimized
              />
              <div>
                <p className="text-emerald-100 text-sm">{saludo()}</p>
                <p className="font-semibold text-lg leading-tight">{user?.user || "Invitado"}</p>
              </div>
            </div>
          </div>

          <p className="text-emerald-100 text-sm mb-1">Saldo disponible</p>
          <p className="text-3xl sm:text-5xl font-bold font-mono-nums tracking-tight mb-6">
            <span className="hidden sm:inline">${saldoTotal.toLocaleString()}</span>
            <span className="sm:hidden">{formatCompact(saldoTotal)}</span>
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/15 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-emerald-200" />
                <p className="text-emerald-100 text-xs">Ingresos</p>
              </div>
              <p className="text-lg sm:text-xl font-bold font-mono-nums">
                <span className="hidden sm:inline">${totalIngresos.toLocaleString()}</span>
                <span className="sm:hidden">{formatCompact(totalIngresos)}</span>
              </p>
            </div>
            <div className="bg-white/15 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <TrendingDown className="w-4 h-4 text-emerald-200" />
                <p className="text-emerald-100 text-xs">Gastos</p>
              </div>
              <p className="text-lg sm:text-xl font-bold font-mono-nums">
                <span className="hidden sm:inline">${totalGastos.toLocaleString()}</span>
                <span className="sm:hidden">{formatCompact(totalGastos)}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Grid inferior */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5">
            <Suspense fallback={<div className="h-24 animate-pulse bg-gray-100 dark:bg-gray-700 rounded-xl" />}>
              <MercadoPagoSync onSynced={fetchTotales} />
            </Suspense>
          </div>
          <DolarWidget />
        </div>

      </div>
    </div>
  );
};

export default Inicio;
