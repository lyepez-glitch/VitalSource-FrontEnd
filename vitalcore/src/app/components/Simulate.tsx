/// import React, { useState,useEffect } from 'react';
import Chart from "./Chart";
import Dashboard from "./Dashboard";
import PopulationEffectsChart from "./PopulationEffectsChart";
import AgingTrendsChart from "./AgingTrendsChart";


type Props = {
  adjustedLifespan : number[];
  populationData: number[],
  updateLifespan:()=> void;
}

const Simulate: React.FC<Props> = ({populationData,adjustedLifespan,updateLifespan}) => {




  return (
    <div className="simContainer flex text-left h-screen">
    <h1 className="text-3xl font-bold text-gray-800 mb-4"> Dashboard</h1>
    <div className="header"></div>
    {/* <p className="text-gray-600 mb-6">Analyze data and simulate life factor effects.</p> */}
    <button onClick={updateLifespan} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
      Simulate 10% Increase
    </button>
    <div className="chartsContainer">
      <Chart lifespanData={adjustedLifespan} />
      <PopulationEffectsChart populationData={populationData} />
      <AgingTrendsChart  lifespanData={adjustedLifespan} />
      <Dashboard lifespanData={adjustedLifespan} />
     </div>
    </div>

  );
};

export default Simulate;
