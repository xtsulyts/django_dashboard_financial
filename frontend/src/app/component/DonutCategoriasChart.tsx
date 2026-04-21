"use client";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { useUser } from "../contex/UserContex";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

type Transaccion = {
  id: number;
  monto: string;
  tipo: "INGRESO" | "GASTO";
  fecha: string;
  categoria_nombre: string | null;
};

const MESES_ES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

const DonutCategoriasChart = () => {
  const { access_token } = useUser();
  const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!access_token) return;
    const fetch_ = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/movimientos/`, {
          headers: { Authorization: `Bearer ${access_token}` },
        });
        if (!res.ok) throw new Error();
        setTransacciones(await res.json());
      } catch {
        setError("No se pudieron cargar los datos");
      } finally {
        setIsLoading(false);
      }
    };
    fetch_();
  }, [access_token]);

  // Agrupar por mes
  const mesesMap: Record<string, { ingresos: number; gastos: number }> = {};
  transacciones.forEach(({ fecha, tipo, monto }) => {
    const mes = fecha.substring(0, 7);
    if (!mesesMap[mes]) mesesMap[mes] = { ingresos: 0, gastos: 0 };
    if (tipo === "INGRESO") mesesMap[mes].ingresos += parseFloat(monto);
    else mesesMap[mes].gastos += parseFloat(monto);
  });

  const meses = Object.keys(mesesMap).sort();
  const labels = meses.map((m) => {
    const [year, month] = m.split("-");
    return `${MESES_ES[parseInt(month) - 1]} ${year}`;
  });

  const data = {
    labels,
    datasets: [
      {
        label: "Ingresos",
        data: meses.map((m) => mesesMap[m].ingresos),
        borderColor: "#5a9e72",
        backgroundColor: "rgba(90,158,114,0.08)",
        pointBackgroundColor: "#5a9e72",
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4,
        fill: true,
      },
      {
        label: "Gastos",
        data: meses.map((m) => mesesMap[m].gastos),
        borderColor: "#c97a75",
        backgroundColor: "rgba(201,122,117,0.08)",
        pointBackgroundColor: "#c97a75",
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: { mode: "index" as const, intersect: false },
    plugins: {
      legend: {
        position: "top" as const,
        labels: { boxWidth: 12, padding: 16, font: { size: 12 } },
      },
      tooltip: {
        callbacks: {
          label: (ctx: { dataset: { label?: string }; parsed: { y: number } }) =>
            ` ${ctx.dataset.label ?? ""}: $${ctx.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        beginAtZero: true,
        grid: { color: "rgba(0,0,0,0.05)" },
        ticks: {
          callback: (v: string | number) => `$${Number(v).toLocaleString()}`,
        },
      },
    },
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-700/60 p-6 rounded-lg shadow text-center text-gray-500">
        Cargando evolución...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-700/60 p-6 rounded-lg shadow text-center text-rose-500">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-700/60 p-6 rounded-lg shadow">
      <h2 className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-5">
        Evolución de ingresos y gastos
      </h2>
      {meses.length === 0 ? (
        <p className="text-center text-gray-400 dark:text-gray-500 py-8">
          No hay movimientos registrados
        </p>
      ) : (
        <Line data={data} options={options} />
      )}
    </div>
  );
};

export default DonutCategoriasChart;
