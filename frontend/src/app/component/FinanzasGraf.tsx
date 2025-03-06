import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { useUser } from "../contex/UserContex";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const FinanzasChart = () => {
  const { totalIngresos, totalGastos, saldoTotal } = useUser();

  const data = {
    labels: ["Ingresos", "Gastos", "Saldo"],
    datasets: [
      {
        label: "Resumen Financiero",
        data: [totalIngresos, totalGastos, saldoTotal],
        backgroundColor: ["#4CAF50", "#F44336", "#2196F3"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="max-w-md mx-autobg-white/30 p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold text-center mb-4">Resumen Financiero</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default FinanzasChart;
