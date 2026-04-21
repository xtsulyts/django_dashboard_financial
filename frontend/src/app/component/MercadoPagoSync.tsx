"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL;

type Periodo = "7d" | "30d" | "90d" | "custom";

interface SyncResult {
  creadas: number;
  duplicadas: number;
  total_mp: number;
}

const periodos: { label: string; value: Periodo }[] = [
  { label: "7 días", value: "7d" },
  { label: "30 días", value: "30d" },
  { label: "3 meses", value: "90d" },
  { label: "Personalizado", value: "custom" },
];

function offsetDate(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split("T")[0];
}

function today(): string {
  return new Date().toISOString().split("T")[0];
}

export default function MercadoPagoSync({ onSynced }: { onSynced?: () => void }) {
  const [conectado, setConectado] = useState<boolean | null>(null);
  const [periodo, setPeriodo] = useState<Periodo>("30d");
  const [fechaDesde, setFechaDesde] = useState(offsetDate(30));
  const [fechaHasta, setFechaHasta] = useState(today());
  const [loading, setLoading] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [resultado, setResultado] = useState<SyncResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  // Verificar estado de conexión al montar
  useEffect(() => {
    checkStatus();
  }, []);

  // Detectar retorno del OAuth flow
  useEffect(() => {
    const mpConnected = searchParams.get("mp_connected");
    const mpError = searchParams.get("mp_error");

    if (mpConnected === "true") {
      setConectado(true);
      router.replace("/inicio"); // limpiar query params
    }
    if (mpError) {
      setError(`Error al conectar MercadoPago: ${mpError}`);
      router.replace("/inicio");
    }
  }, [searchParams, router]);

  async function checkStatus() {
    const token = localStorage.getItem("access_token");
    try {
      const r = await fetch(`${API}/mp/status/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const d = await r.json();
      setConectado(d.conectado);
    } catch {
      setConectado(false);
    }
  }

  async function handleConnect() {
    setConnecting(true);
    setError(null);
    const token = localStorage.getItem("access_token");
    try {
      const res = await fetch(`${API}/mp/oauth/init/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.auth_url) {
        window.location.href = data.auth_url;
      } else {
        setError("No se pudo obtener la URL de autorización");
        setConnecting(false);
      }
    } catch {
      setError("Error de conexión con el servidor");
      setConnecting(false);
    }
  }

  async function handleDisconnect() {
    const token = localStorage.getItem("access_token");
    await fetch(`${API}/mp/disconnect/`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    setConectado(false);
    setResultado(null);
  }

  function handlePeriodo(p: Periodo) {
    setPeriodo(p);
    setResultado(null);
    if (p === "7d") { setFechaDesde(offsetDate(7)); setFechaHasta(today()); }
    if (p === "30d") { setFechaDesde(offsetDate(30)); setFechaHasta(today()); }
    if (p === "90d") { setFechaDesde(offsetDate(90)); setFechaHasta(today()); }
  }

  async function handleSync() {
    setLoading(true);
    setError(null);
    setResultado(null);
    const token = localStorage.getItem("access_token");
    try {
      const res = await fetch(`${API}/mp/sync/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fecha_desde: fechaDesde, fecha_hasta: fechaHasta }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error al sincronizar");
        return;
      }
      setResultado(data);
      if (data.creadas > 0) onSynced?.();
    } catch {
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white dark:bg-gray-700/60 rounded-xl p-4 space-y-3">

      {/* Header con estado */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-700">MercadoPago</span>
          {conectado === null && (
            <span className="text-xs text-gray-400">verificando...</span>
          )}
          {conectado === true && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
              conectado
            </span>
          )}
          {conectado === false && (
            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
              no conectado
            </span>
          )}
        </div>
        {conectado === true && (
          <button
            onClick={handleDisconnect}
            className="text-xs text-red-500 hover:underline"
          >
            Desconectar
          </button>
        )}
      </div>

      {/* Estado: no conectado → botón de conexión */}
      {conectado === false && (
        <button
          onClick={handleConnect}
          disabled={connecting}
          className="w-full py-2.5 rounded-lg text-sm font-medium bg-[#009EE3] text-white hover:bg-[#008BC8] disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
        >
          {connecting ? "Redirigiendo..." : "Conectar con MercadoPago"}
        </button>
      )}

      {/* Estado: conectado → UI de sync */}
      {conectado === true && (
        <>
          {/* Selector de período */}
          <div className="flex gap-2 flex-wrap">
            {periodos.map((p) => (
              <button
                key={p.value}
                onClick={() => handlePeriodo(p.value)}
                className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                  periodo === p.value
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white dark:bg-gray-600 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-500 hover:border-blue-400"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Fechas custom */}
          {periodo === "custom" && (
            <div className="flex gap-2 items-center">
              <input
                type="date"
                value={fechaDesde}
                max={fechaHasta}
                onChange={(e) => setFechaDesde(e.target.value)}
                className="text-xs border border-gray-300 dark:border-gray-500 rounded px-2 py-1 bg-white dark:bg-gray-600 dark:text-gray-200"
              />
              <span className="text-xs text-gray-500">→</span>
              <input
                type="date"
                value={fechaHasta}
                min={fechaDesde}
                max={today()}
                onChange={(e) => setFechaHasta(e.target.value)}
                className="text-xs border border-gray-300 dark:border-gray-500 rounded px-2 py-1 bg-white dark:bg-gray-600 dark:text-gray-200"
              />
            </div>
          )}

          {periodo !== "custom" && (
            <p className="text-xs text-gray-500">{fechaDesde} → {fechaHasta}</p>
          )}

          {/* Botón sync */}
          <button
            onClick={handleSync}
            disabled={loading}
            className="w-full py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Sincronizando..." : "Sincronizar movimientos"}
          </button>
        </>
      )}

      {/* Resultado */}
      {resultado && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm space-y-1">
          <p className="font-medium text-green-700">Sincronización completada</p>
          <p className="text-gray-600">
            <span className="font-semibold text-green-600">{resultado.creadas}</span> transacciones importadas
          </p>
          {resultado.duplicadas > 0 && (
            <p className="text-gray-500">{resultado.duplicadas} ya existían (omitidas)</p>
          )}
          <p className="text-gray-400 text-xs">{resultado.total_mp} pagos encontrados en MP</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
}
