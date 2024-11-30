"use client";

import Chart from "./components/Chart";
import Dashboard from "./components/Dashboard";
import PopulationEffectsChart from "./components/PopulationEffectsChart";
import AgingTrendsChart from "./components/AgingTrendsChart";
import { useState, useEffect } from "react";

// Helper function: Moved outside component
const calculatePopulation = (lifespanData: number[]): number[] => {
  const initialPopulation = 1000;
  let currentPopulation = initialPopulation;
  const populationOverTime: number[] = [];

  lifespanData.forEach((lifespan) => {
    const growthFactor = lifespan / 10; // Example: Longer lifespan increases population
    currentPopulation += currentPopulation * growthFactor * 0.1; // Adjust by 10%
    populationOverTime.push(Math.round(currentPopulation));
  });

  return populationOverTime;
};

export default function Home() {
  const [lifespanData, setLifespanData] = useState<number[]>([]);
  const [populationData, setPopulationData] = useState<number[]>([]);

  // Fetch data using useEffect
  useEffect(() => {
    async function fetchCellData() {
      try {
        const response = await fetch("http://localhost:3306/cells");
        const data = await response.json();
        console.log("cells response ", data);

        if (data.lifespan && Array.isArray(data.lifespan)) {
          setLifespanData(data.lifespan);
          setPopulationData(calculatePopulation(data.lifespan));
        } else {
          console.error("Unexpected API response format.");
        }
      } catch (error) {
        console.error("Error fetching cell data:", error);
      }
    }

    fetchCellData();
  }, []);

  const updateLifespan = async () => {
    const updatedLifespan = lifespanData.map((value) => value * 1.1);

    try {
      const response = await fetch("http://localhost:3306/cells", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lifespan: updatedLifespan,
        }),
      });

      if (response.ok) {
        console.log("Successfully updated lifespan data.");
        setLifespanData(updatedLifespan);
        setPopulationData(calculatePopulation(updatedLifespan));
      } else {
        console.error("Failed to update lifespan data.");
      }
    } catch (error) {
      console.error("Error updating lifespan data:", error);
    }
  };

  return (
    <main style={{ padding: "20px" }}>
      <h1>VitalCore Dashboard</h1>
      <p>Analyze data and simulate life factor effects.</p>
      <button onClick={updateLifespan}>Simulate 10% Increase</button>
      <Dashboard lifespanData={lifespanData} />
      <Chart lifespanData={lifespanData} />
      <PopulationEffectsChart populationData={populationData} />
      <AgingTrendsChart lifespanData={lifespanData} />
    </main>
  );
}
