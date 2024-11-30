"use client";

import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { useEffect, useState } from "react";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface AgingTrendsChartProps {
  lifespanData: number[]; // Array of lifespan values
}

const AgingTrendsChart: React.FC<AgingTrendsChartProps> = ({ lifespanData }) => {
  const [agingData, setAgingData] = useState<number[]>([]);

  useEffect(() => {
    // Calculate average aging trends
    const calculateAgingTrends = (lifespanData: number[]) => {
      const baseAge = 30; // Starting average age, can be adjusted
      const agingTrends = lifespanData.map((lifespan) => baseAge + lifespan / 2); // Example formula
      return agingTrends;
    };

    if (lifespanData.length > 0) {
      setAgingData(calculateAgingTrends(lifespanData));
    }
  }, [lifespanData]);

  const chartData = {
    labels: lifespanData.map((_, index) => `Year ${index + 1}`), // Create labels based on years
    datasets: [
      {
        label: "Average Age Over Time",
        data: agingData,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 2,
        tension: 0.4, // Smooth curve
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Aging Trends Over Time",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Time (Years)",
        },
      },
      y: {
        title: {
          display: true,
          text: "Average Age",
        },
        beginAtZero: false,
      },
    },
  };

  return (
    <div>
      <h2>Aging Trends</h2>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default AgingTrendsChart;
