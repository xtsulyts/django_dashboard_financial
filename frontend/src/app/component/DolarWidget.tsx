"use client";
import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

type Cotizacion = {
  value_buy: number;
  value_sell: number;
  value_avg: number;
};

type DolarData = {
  oficial: Cotizacion;
  blue: Cotizacion;
  mep: Cotizacion;
  last_update: string;
};

const tipos = [
  { key: "oficial" as const, label: "Oficial" },
  { key: "blue" as const,    label: "Blue"    },
  { key: "mep" as const,     label: "MEP"     },
];

export default function DolarWidget() {
  const [data, setData] = useState<DolarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lastUpdate, setLastUpdate] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("https://api.bluelytics.com.ar/v2/latest");
      if (!res.ok) throw new Error();
      const json = await res.json();
      setData(json);
      const fecha = new Date(json.last_update);
      setLastUpdate(fecha.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }));
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">Dólar hoy</p>
          {lastUpdate && (
            <p className="text-xs text-gray-400 dark:text-gray-500">Actualizado {lastUpdate}</p>
          )}
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-40"
          aria-label="Actualizar cotización"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {error && (
        <p className="text-xs text-rose-400 text-center py-2">No se pudo obtener la cotización</p>
      )}

      {!error && (
        <div className="grid grid-cols-3 gap-3">
          {tipos.map(({ key, label }) => {
            const cot = data?.[key];
            return (
              <div key={key} className="bg-slate-50 dark:bg-gray-700/50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">{label}</p>
                {loading || !cot ? (
                  <div className="h-5 w-16 mx-auto bg-gray-200 dark:bg-gray-600 rounded animate-pulse" />
                ) : (
                  <>
                    <p className="text-sm font-bold text-gray-700 dark:text-gray-200 font-mono-nums">
                      ${cot.value_sell.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 font-mono-nums">
                      C: ${cot.value_buy.toLocaleString()}
                    </p>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
