"use client";
import { useEffect, useState } from "react";
import { useUser } from "../contex/UserContex";
import { TrendingUp, TrendingDown, Tag } from "lucide-react";

interface Transaccion {
  id: number;
  monto: string;
  fecha: string;
  descripcion: string;
  tipo: string;
  categoria_nombre?: string;
}

const MESES_ES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

function formatFecha(fechaStr: string) {
  const [, mes, dia] = fechaStr.split("-");
  return { dia, mes: MESES_ES[parseInt(mes) - 1] };
}

const TransaccionesListComponent = () => {
  const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { access_token } = useUser();

  useEffect(() => {
    const fetchTransacciones = async () => {
      if (!access_token) return;
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/movimientos/`, {
          headers: { Authorization: `Bearer ${access_token}` },
        });
        if (!response.ok) throw new Error(`Error ${response.status}`);
        const data: Transaccion[] = await response.json();
        setTransacciones(data.sort((a, b) => b.fecha.localeCompare(a.fecha)));
      } catch {
        setError("Error al obtener los movimientos");
      } finally {
        setLoading(false);
      }
    };
    fetchTransacciones();
  }, [access_token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">

          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Mis Movimientos</h2>
            {!loading && !error && (
              <span className="text-sm text-gray-400 dark:text-gray-500">
                {transacciones.length} registros
              </span>
            )}
          </div>

          {/* Columnas */}
          {!loading && !error && transacciones.length > 0 && (
            <div className="grid grid-cols-[64px_1fr_auto] md:grid-cols-[64px_1fr_120px_auto] px-6 py-2 border-b border-gray-100 dark:border-gray-700">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Fecha</span>
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Descripción</span>
              <span className="hidden md:block text-xs font-medium text-gray-400 uppercase tracking-wide">Categoría</span>
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide text-right">Monto</span>
            </div>
          )}

          {/* Estados */}
          {loading && (
            <p className="text-gray-400 dark:text-gray-500 text-center py-16">Cargando movimientos...</p>
          )}
          {error && (
            <p className="text-rose-500 text-center py-16">{error}</p>
          )}
          {!loading && !error && transacciones.length === 0 && (
            <p className="text-gray-400 dark:text-gray-500 text-center py-16">No hay movimientos registrados.</p>
          )}

          {/* Lista */}
          {!loading && !error && transacciones.map((t, i) => {
            const esIngreso = t.tipo === "INGRESO";
            const { dia, mes } = formatFecha(t.fecha);
            return (
              <div
                key={t.id}
                className={`grid grid-cols-[64px_1fr_auto] md:grid-cols-[64px_1fr_120px_auto] items-center px-6 py-4 border-l-4 transition-colors hover:bg-slate-50 dark:hover:bg-gray-700/40 ${
                  esIngreso ? "border-l-emerald-400" : "border-l-rose-400"
                } ${i !== transacciones.length - 1 ? "border-b border-gray-100 dark:border-gray-700/50" : ""}`}
              >
                {/* Fecha */}
                <div className="flex flex-col items-center w-10">
                  <span className="text-base font-bold text-gray-700 dark:text-gray-200 leading-none">{dia}</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 uppercase">{mes}</span>
                </div>

                {/* Descripción + tipo badge */}
                <div className="min-w-0 pl-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                    {t.descripcion || "Sin descripción"}
                  </p>
                  <span className={`inline-flex items-center gap-1 text-xs mt-0.5 ${
                    esIngreso ? "text-emerald-500 dark:text-emerald-400" : "text-rose-400 dark:text-rose-400"
                  }`}>
                    {esIngreso ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {t.tipo}
                  </span>
                </div>

                {/* Categoría (solo desktop) */}
                <div className="hidden md:flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                  {t.categoria_nombre && (
                    <>
                      <Tag className="w-3 h-3 shrink-0" />
                      <span className="truncate">{t.categoria_nombre}</span>
                    </>
                  )}
                </div>

                {/* Monto */}
                <div className={`text-sm font-bold text-right font-mono-nums ${
                  esIngreso ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500 dark:text-rose-400"
                }`}>
                  {esIngreso ? "+" : "-"}${parseFloat(t.monto).toLocaleString()}
                </div>
              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
};

export default TransaccionesListComponent;
