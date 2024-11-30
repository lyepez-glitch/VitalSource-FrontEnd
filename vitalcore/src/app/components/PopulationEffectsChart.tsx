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

  return <Line data={data} />;
};

export default PopulationEffectsChart;
