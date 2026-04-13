"use client";
import { useEffect, useRef, useState } from "react";
import Papa from "papaparse";
import { useUser } from "../contex/UserContex";
import { useRouter } from "next/navigation";

// ─── Tipos ────────────────────────────────────────────────────────────────────

type Categoria = { id: number; nombre: string };

type ColumnMap = {
  fecha: string;
  monto: string;
  descripcion: string;
  tipo: string; // columna del CSV o "" si se infiere del signo
};

type TransaccionPreview = {
  _id: number; // id temporal para el key de React
  fecha: string;
  monto: number;
  descripcion: string;
  tipo: "INGRESO" | "GASTO";
  categoriaId: number | undefined;
  seleccionada: boolean;
};

// ─── Reglas de auto-categorización ───────────────────────────────────────────
// Agregá o quitá keywords según los extractos de tu banco

const REGLAS: Array<{
  keywords: string[];
  categoria: string;
  tipo: "INGRESO" | "GASTO";
}> = [
  {
    keywords: ["uber", "cabify", "taxi", "subte", "sube", "colectivo", "combustible", "nafta", "peaje", "transporte"],
    categoria: "transporte",
    tipo: "GASTO",
  },
  {
    keywords: ["luz", "gas", "agua", "internet", "telefono", "edesur", "metrogas", "telecentro", "personal", "claro", "movistar", "fibertel", "servicio"],
    categoria: "servicios",
    tipo: "GASTO",
  },
  {
    keywords: ["sueldo", "haberes", "remuneracion", "acreditacion sueldo"],
    categoria: "sueldo",
    tipo: "INGRESO",
  },
  {
    keywords: ["freelance", "freeland", "honorarios"],
    categoria: "freeland",
    tipo: "INGRESO",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const parseFecha = (str: string): string => {
  // DD/MM/YYYY → YYYY-MM-DD
  const ddmmyyyy = str.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (ddmmyyyy) return `${ddmmyyyy[3]}-${ddmmyyyy[2]}-${ddmmyyyy[1]}`;
  // YYYY-MM-DD ya es correcto
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
  return new Date().toISOString().split("T")[0];
};

const parseMonto = (str: string): number => {
  const limpio = str.replace(/[^0-9.,-]/g, "").replace(",", ".");
  return parseFloat(limpio) || 0;
};

const autoCategorizar = (
  descripcion: string,
  categorias: Categoria[]
): number | undefined => {
  const desc = descripcion.toLowerCase();
  for (const regla of REGLAS) {
    if (regla.keywords.some((k) => desc.includes(k))) {
      const cat = categorias.find(
        (c) => c.nombre.toLowerCase() === regla.categoria
      );
      return cat?.id;
    }
  }
  return undefined;
};

// ─── Componente ───────────────────────────────────────────────────────────────

const ImportarCSV = () => {
  const { access_token, fetchTotales } = useUser();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [headers, setHeaders] = useState<string[]>([]);
  const [rawRows, setRawRows] = useState<Record<string, string>[]>([]);
  const [columnMap, setColumnMap] = useState<ColumnMap>({
    fecha: "",
    monto: "",
    descripcion: "",
    tipo: "",
  });
  const [transacciones, setTransacciones] = useState<TransaccionPreview[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [resultado, setResultado] = useState<{ creadas: number; errores: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Cargar categorías del backend
  useEffect(() => {
    if (!access_token) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categorias/`, {
      headers: { Authorization: `Bearer ${access_token}` },
    })
      .then((r) => r.json())
      .then(setCategorias)
      .catch(() => setError("No se pudieron cargar las categorías"));
  }, [access_token]);

  // ── Paso 1: parsear el archivo ──────────────────────────────────────────────

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        if (result.data.length === 0) {
          setError("El archivo está vacío o no tiene el formato correcto.");
          return;
        }
        setHeaders(result.meta.fields ?? []);
        setRawRows(result.data);
        setStep(2);
      },
      error: () => setError("Error al leer el archivo. Verificá que sea un CSV válido."),
    });
  };

  // ── Paso 2: construir preview con la configuración de columnas ──────────────

  const construirPreview = () => {
    if (!columnMap.fecha || !columnMap.monto) {
      setError("Tenés que mapear al menos Fecha y Monto.");
      return;
    }
    setError(null);

    const previews: TransaccionPreview[] = rawRows.map((row, i) => {
      const montoRaw = parseMonto(row[columnMap.monto] ?? "0");
      const descripcion = columnMap.descripcion ? (row[columnMap.descripcion] ?? "") : "";

      // Determinar tipo
      let tipo: "INGRESO" | "GASTO";
      if (columnMap.tipo && row[columnMap.tipo]) {
        const tipoRaw = row[columnMap.tipo].toLowerCase();
        tipo = tipoRaw.includes("ingreso") || tipoRaw.includes("credito") || tipoRaw.includes("crédito")
          ? "INGRESO"
          : "GASTO";
      } else {
        tipo = montoRaw >= 0 ? "INGRESO" : "GASTO";
      }

      return {
        _id: i,
        fecha: parseFecha(row[columnMap.fecha] ?? ""),
        monto: Math.abs(montoRaw),
        descripcion,
        tipo,
        categoriaId: autoCategorizar(descripcion, categorias),
        seleccionada: true,
      };
    });

    setTransacciones(previews);
    setStep(3);
  };

  // ── Paso 3: actualizar fila en el preview ───────────────────────────────────

  const actualizarFila = (
    id: number,
    campo: keyof TransaccionPreview,
    valor: unknown
  ) => {
    setTransacciones((prev) =>
      prev.map((t) => (t._id === id ? { ...t, [campo]: valor } : t))
    );
  };

  // ── Paso 3: confirmar importación ───────────────────────────────────────────

  const handleImportar = async () => {
    const seleccionadas = transacciones.filter((t) => t.seleccionada);

    if (seleccionadas.some((t) => !t.categoriaId)) {
      setError("Todas las transacciones seleccionadas deben tener categoría.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/importar-transacciones/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
          body: JSON.stringify({
            transacciones: seleccionadas.map((t) => ({
              monto: t.monto,
              fecha: t.fecha,
              tipo: t.tipo,
              descripcion: t.descripcion,
              categoriaId: t.categoriaId,
            })),
          }),
        }
      );

      const data = await res.json();
      setResultado({ creadas: data.creadas, errores: data.errores?.length ?? 0 });
      fetchTotales();
    } catch {
      setError("Error al importar. Revisá tu conexión e intentá de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  if (resultado) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
          <div className="text-6xl mb-4">{resultado.errores === 0 ? "✅" : "⚠️"}</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Importación completada
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-1">
            <strong className="text-green-600">{resultado.creadas}</strong> transacciones importadas
          </p>
          {resultado.errores > 0 && (
            <p className="text-gray-600 dark:text-gray-300 mb-1">
              <strong className="text-red-500">{resultado.errores}</strong> con errores
            </p>
          )}
          <div className="flex gap-3 mt-8">
            <button
              onClick={() => { setStep(1); setResultado(null); setRawRows([]); setHeaders([]); }}
              className="flex-1 py-3 border-2 border-gray-300 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Importar otro
            </button>
            <button
              onClick={() => router.push("/movimientos")}
              className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
            >
              Ver movimientos
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-1">
            Importar extracto bancario
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Subí un CSV de MercadoPago o Santander y categorizamos automáticamente
          </p>
        </div>

        {/* Indicador de pasos */}
        <div className="flex items-center mb-8">
          {[
            { n: 1, label: "Subir archivo" },
            { n: 2, label: "Mapear columnas" },
            { n: 3, label: "Revisar y confirmar" },
          ].map(({ n, label }, i) => (
            <div key={n} className="flex items-center">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    step >= n
                      ? "bg-emerald-500 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                  }`}
                >
                  {n}
                </div>
                <span className={`text-sm hidden md:block ${step >= n ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-gray-400"}`}>
                  {label}
                </span>
              </div>
              {i < 2 && (
                <div className={`h-px w-8 md:w-16 mx-2 ${step > n ? "bg-emerald-500" : "bg-gray-200 dark:bg-gray-700"}`} />
              )}
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400">
            ⚠️ {error}
          </div>
        )}

        {/* ── Paso 1: Upload ──────────────────────────────────────────────── */}
        {step === 1 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-8">
            <div
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-12 text-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10 transition-all"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="text-5xl mb-4">📂</div>
              <p className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-1">
                Arrastrá o hacé click para subir
              </p>
              <p className="text-sm text-gray-400">Solo archivos .csv</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFile}
              />
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <p className="font-medium text-blue-700 dark:text-blue-300 mb-1">MercadoPago</p>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Mi cuenta → Actividad → Descargar movimientos
                </p>
              </div>
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
                <p className="font-medium text-red-700 dark:text-red-300 mb-1">Santander</p>
                <p className="text-sm text-red-600 dark:text-red-400">
                  Home banking → Movimientos → Exportar → CSV
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Paso 2: Mapeo de columnas ───────────────────────────────────── */}
        {step === 2 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-8">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
              ¿Qué columna es cada campo?
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Se detectaron <strong>{rawRows.length}</strong> filas y{" "}
              <strong>{headers.length}</strong> columnas: {headers.join(", ")}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {(
                [
                  { key: "fecha", label: "Fecha *", required: true },
                  { key: "monto", label: "Monto *", required: true },
                  { key: "descripcion", label: "Descripción", required: false },
                  { key: "tipo", label: "Tipo (si no existe, se infiere del signo)", required: false },
                ] as const
              ).map(({ key, label, required }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    {label}
                  </label>
                  <select
                    value={columnMap[key]}
                    onChange={(e) =>
                      setColumnMap((prev) => ({ ...prev, [key]: e.target.value }))
                    }
                    className="w-full px-3 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl outline-none focus:border-emerald-500 text-gray-800 dark:text-gray-200"
                  >
                    <option value="">{required ? "Seleccioná una columna" : "— ninguna —"}</option>
                    {headers.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                ← Volver
              </button>
              <button
                onClick={construirPreview}
                className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
              >
                Ver preview →
              </button>
            </div>
          </div>
        )}

        {/* ── Paso 3: Preview + categorías ───────────────────────────────── */}
        {step === 3 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  Revisá las transacciones
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {transacciones.filter((t) => t.seleccionada).length} de{" "}
                  {transacciones.length} seleccionadas
                </p>
              </div>
              <button
                onClick={() => setStep(2)}
                className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ← Volver
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-4 py-3 text-left w-8"></th>
                    <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-300">Fecha</th>
                    <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-300">Descripción</th>
                    <th className="px-4 py-3 text-right text-gray-600 dark:text-gray-300">Monto</th>
                    <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-300">Tipo</th>
                    <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-300">Categoría</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {transacciones.map((t) => (
                    <tr
                      key={t._id}
                      className={`transition-colors ${
                        t.seleccionada
                          ? "bg-white dark:bg-gray-800"
                          : "bg-gray-50 dark:bg-gray-700/30 opacity-50"
                      }`}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={t.seleccionada}
                          onChange={(e) => actualizarFila(t._id, "seleccionada", e.target.checked)}
                          className="w-4 h-4 accent-emerald-500"
                        />
                      </td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300 whitespace-nowrap">
                        {t.fecha}
                      </td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300 max-w-xs truncate">
                        {t.descripcion || "—"}
                      </td>
                      <td className="px-4 py-3 text-right font-medium whitespace-nowrap">
                        <span className={t.tipo === "INGRESO" ? "text-green-600" : "text-red-500"}>
                          {t.tipo === "INGRESO" ? "+" : "-"}${t.monto.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={t.tipo}
                          onChange={(e) =>
                            actualizarFila(t._id, "tipo", e.target.value as "INGRESO" | "GASTO")
                          }
                          className="px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-600 text-xs bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300"
                        >
                          <option value="INGRESO">Ingreso</option>
                          <option value="GASTO">Gasto</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={t.categoriaId ?? ""}
                          onChange={(e) =>
                            actualizarFila(
                              t._id,
                              "categoriaId",
                              e.target.value ? parseInt(e.target.value) : undefined
                            )
                          }
                          className={`px-2 py-1 rounded-lg border text-xs bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 ${
                            !t.categoriaId && t.seleccionada
                              ? "border-red-400"
                              : "border-gray-200 dark:border-gray-600"
                          }`}
                        >
                          <option value="">Sin categoría</option>
                          {categorias.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.nombre}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-6 border-t border-gray-100 dark:border-gray-700">
              <button
                onClick={handleImportar}
                disabled={isLoading || transacciones.filter((t) => t.seleccionada).length === 0}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Importando...
                  </span>
                ) : (
                  `Importar ${transacciones.filter((t) => t.seleccionada).length} transacciones`
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportarCSV;
