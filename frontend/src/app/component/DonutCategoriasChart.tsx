"use client";
import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useUser } from "../contex/UserContex";

ChartJS.register(ArcElement, Tooltip, Legend);

type Transaccion = {
  id: number;
  monto: string;
  tipo: "INGRESO" | "GASTO";
  categoria_nombre: string;
};

const COLORES = [
  "#4CAF50", "#2196F3", "#FF9800", "#9C27B0",
  "#00BCD4", "#F44336", "#8BC34A", "#FF5722",
];

const DonutCategoriasChart = () => {
  const { access_token } = useUser();
  const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tipoActivo, setTipoActivo] = useState<"GASTO" | "INGRESO">("GASTO");

  useEffect(() => {
    if (!access_token) return;

    const fetchTransacciones = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/movimientos/`, {
          headers: { Authorization: `Bearer ${access_token}` },
        });
        if (!res.ok) throw new Error("Error al obtener transacciones");
        const data = await res.json();
        setTransacciones(data);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los datos");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransacciones();
  }, [access_token]);

  // Agrupar por categoría según el tipo activo
  const totalesPorCategoria: Record<string, number> = {};

  transacciones
    .filter((t) => t.tipo === tipoActivo)
    .forEach(({ categoria_nombre, monto }) => {
      const nombre = categoria_nombre || "Sin categoría";
      totalesPorCategoria[nombre] = (totalesPorCategoria[nombre] || 0) + parseFloat(monto);
    });

  const categorias = Object.keys(totalesPorCategoria);
  const valores = categorias.map((c) => totalesPorCategoria[c]);

  const data = {
    labels: categorias,
    datasets: [
      {
        data: valores,
        backgroundColor: COLORES.slice(0, categorias.length),
        borderWidth: 2,
        borderColor: "#ffffff",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" as const },
      tooltip: {
        callbacks: {
          label: (context: { label: string; parsed: number }) => {
            const total = valores.reduce((a, b) => a + b, 0);
            const porcentaje = total > 0 ? ((context.parsed / total) * 100).toFixed(1) : "0";
            return ` ${context.label}: $${context.parsed.toLocaleString()} (${porcentaje}%)`;
          },
        },
      },
    },
  };

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto bg-white/30 p-6 rounded-lg shadow text-center text-gray-600">
        Cargando distribución por categoría...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto bg-white/30 p-6 rounded-lg shadow text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white/30 p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold text-center mb-4">Por categoría</h2>

      {/* Toggle */}
      <div className="flex justify-center mb-6">
        <div className="flex bg-white/40 rounded-xl p-1 gap-1">
          <button
            onClick={() => setTipoActivo("GASTO")}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              tipoActivo === "GASTO"
                ? "bg-red-500 text-white shadow"
                : "text-gray-600 hover:bg-white/50"
            }`}
          >
            Gastos
          </button>
          <button
            onClick={() => setTipoActivo("INGRESO")}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              tipoActivo === "INGRESO"
                ? "bg-green-500 text-white shadow"
                : "text-gray-600 hover:bg-white/50"
            }`}
          >
            Ingresos
          </button>
        </div>
      </div>

      {categorias.length === 0 ? (
        <p className="text-center text-gray-500">
          Sin {tipoActivo === "GASTO" ? "gastos" : "ingresos"} registrados
        </p>
      ) : (
        <Doughnut data={data} options={options} />
      )}
    </div>
  );
};

export default DonutCategoriasChart;
