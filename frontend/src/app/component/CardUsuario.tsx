"use client";

import { useUser } from "../contex/UserContex";
import { useRouter } from "next/navigation";
import { PlusCircle, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import FinanzasMensualChart from "./FinanzasMensualChart";
import DonutCategoriasChart from "./DonutCategoriasChart";

function formatCompact(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(abs % 1_000_000 === 0 ? 0 : 1)}M`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(abs % 1_000 === 0 ? 0 : 1)}k`;
  return `${sign}$${abs.toLocaleString()}`;
}

const CardUsuario: React.FC = () => {
  const router = useRouter();
  const { user, totalIngresos, totalGastos, saldoTotal } = useUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Cards de totales */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5 text-center">
            <TrendingUp className="w-5 h-5 text-emerald-500 mx-auto mb-2" />
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Ingresos</p>
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono-nums">
              <span className="hidden sm:inline">${totalIngresos.toLocaleString()}</span>
              <span className="sm:hidden">{formatCompact(totalIngresos)}</span>
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5 text-center">
            <TrendingDown className="w-5 h-5 text-rose-400 mx-auto mb-2" />
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Gastos</p>
            <p className="text-xl font-bold text-rose-500 dark:text-rose-400 font-mono-nums">
              <span className="hidden sm:inline">${totalGastos.toLocaleString()}</span>
              <span className="sm:hidden">{formatCompact(totalGastos)}</span>
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5 text-center">
            <Wallet className="w-5 h-5 text-slate-400 mx-auto mb-2" />
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Saldo</p>
            <p className="text-xl font-bold text-slate-600 dark:text-slate-300 font-mono-nums">
              <span className="hidden sm:inline">${saldoTotal.toLocaleString()}</span>
              <span className="sm:hidden">{formatCompact(saldoTotal)}</span>
            </p>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          <FinanzasMensualChart />
          <DonutCategoriasChart />
        </div>

        {/* Acción */}
        {user && (
          <button
            onClick={() => router.push("/transacciones")}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white py-3.5 rounded-xl font-semibold shadow-md transition-all duration-300"
          >
            <PlusCircle className="w-5 h-5" />
            Agregar Transacción
          </button>
        )}

      </div>
    </div>
  );
};

export default CardUsuario;
