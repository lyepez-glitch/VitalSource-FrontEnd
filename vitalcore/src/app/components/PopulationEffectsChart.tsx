import { Line } from "react-chartjs-2";

type PopulationEffectsChartProps = {
  populationData: number[];
};

const PopulationEffectsChart: React.FC<PopulationEffectsChartProps> = ({ populationData }) => {
  const labels = populationData.map((_, index) => `Time ${index + 1}`);

  const data = {
    labels,
    datasets: [
      {
        label: "Population Over Time",
        data: populationData,
        fill: false,
        backgroundColor: "rgb(75, 192, 192)",
        borderColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Population Effects Over Time
      </h2>
      <div className="bg-gray-50 p-4 rounded-lg">
        <Line data={data} />
      </div>
    </div>
  );
};

export default PopulationEffectsChart;
