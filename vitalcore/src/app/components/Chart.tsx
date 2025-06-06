"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js modules
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);



export default function Chart({lifespanData}:{lifespanData:number[]}) {


  // Sample chart data
const data = {
  labels: ["January", "February", "March", "April", "May"],
  datasets: [
    {
      label: "Lifespan (years)",
      data: lifespanData,
      borderColor: "rgba(75,192,192,1)",
      backgroundColor: "rgba(75,192,192,0.2)",
    },
  ],
};

// Chart options
const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Simulation Results",
    },
  },
};
  return (
    <div className="chart max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-300">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Lifespan Simulation Chart</h2>
      <div className="p-4 bg-gray-50 rounded-lg">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}