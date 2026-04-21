"use client";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useUser } from "../contex/UserContex";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type Transaccion = {
  id: number;
  monto: string;
  fecha: string;
  tipo: "INGRESO" | "GASTO";
  categoria_nombre: string;
};

const MESES_ES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

const FinanzasMensualChart = () => {
  const { access_token } = useUser();
  const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Agrupar transacciones por mes: { "2024-01": { ingresos: X, gastos: Y } }
  const mesesMap: Record<string, { ingresos: number; gastos: number }> = {};

  transacciones.forEach(({ fecha, tipo, monto }) => {
    const mes = fecha.substring(0, 7); // "2024-01"
    if (!mesesMap[mes]) mesesMap[mes] = { ingresos: 0, gastos: 0 };
    const valor = parseFloat(monto);
    if (tipo === "INGRESO") mesesMap[mes].ingresos += valor;
    else mesesMap[mes].gastos += valor;
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
        backgroundColor: "#5a9e72",
        borderRadius: 6,
      },
      {
        label: "Gastos",
        data: meses.map((m) => mesesMap[m].gastos),
        backgroundColor: "#c97a75",
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-700/60 p-6 rounded-lg shadow text-center text-gray-600 h-full flex items-center justify-center">
        Cargando evolución mensual...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-700/60 p-6 rounded-lg shadow text-center text-red-500 h-full flex items-center justify-center">
        {error}
      </div>
    );
  }

  if (meses.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-700/60 p-6 rounded-lg shadow text-center text-gray-500 h-full flex items-center justify-center">
        Sin transacciones para mostrar
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-700/60 p-6 rounded-lg shadow h-full flex flex-col">
      <h2 className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-5">Evolución mensual</h2>
      <div className="relative flex-1 min-h-[200px]">
        <Bar data={data} options={{ ...options, maintainAspectRatio: false }} />
      </div>
    </div>
  );
};

export default FinanzasMensualChart;
