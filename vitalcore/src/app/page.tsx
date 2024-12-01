"use client";

import Chart from "./components/Chart";
import Dashboard from "./components/Dashboard";
import PopulationEffectsChart from "./components/PopulationEffectsChart";
import AgingTrendsChart from "./components/AgingTrendsChart";
import { useState, useEffect } from "react";
import { getGenes, addGene, modifyGene } from "./graphql"; // Assuming these functions are moved to a separate file


// Define a type for genes
interface Gene {
  id: string;
  name: string;
  impact_on_lifespan: number;
}

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
  const [adjustedLifespan, setAdjustedLifespan] = useState<number[]>([]);
  const [genesData, setGenesData] = useState<Gene[]>([]);
  const [newGeneName, setNewGeneName] = useState<string>("");
  const [newGeneImpact, setNewGeneImpact] = useState<number>(0);
  const [modifyGeneId, setModifyGeneId] = useState<string>("");
  const [modifyGeneImpact, setModifyGeneImpact] = useState<number>(0);
  const [newGeneMutationRate, setNewGeneMutationRate] = useState(0);
  // Fetch data using useEffect
  useEffect(() => {
    async function fetchCellData() {
      try {
        // Fetch cells data
        const response = await fetch("http://localhost:3306/cells");
        const data = await response.json();
        console.log("cells response ", data);

        // Fetch genes data via GraphQL
        const genesResponse = await getGenes();
        console.log("genes data", genesResponse); // Log the whole response

        setGenesData(genesResponse); // Set the genesData directly from the response

        // Combine data
        const adjusted = applyGeneEffects(data.lifespan, genesResponse); // Apply gene effects
        console.log("adjusted", adjusted);
        setAdjustedLifespan(adjusted);

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

  const applyGeneEffects = (lifespan: number[], genes: Gene[]) => {
    return lifespan.map((life) => {
      let geneEffect = 0;
      genes.forEach((gene) => {
        geneEffect += gene.impact_on_lifespan;
      });
      return Math.round(life + life * geneEffect);
    });
  };

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
        setAdjustedLifespan(updatedLifespan);
      } else {
        console.error("Failed to update lifespan data.");
      }
    } catch (error) {
      console.error("Error updating lifespan data:", error);
    }
  };

  // Function to handle adding a new gene
  const handleAddGene = async () => {
    try {
      const newGene = await addGene(newGeneName, newGeneMutationRate, newGeneImpact); // Provide all 3 arguments
      setGenesData([...genesData, newGene]); // Add the new gene to the genesData state
      setNewGeneName(""); // Clear the input
      setNewGeneImpact(0); // Clear the input
      setNewGeneMutationRate(0); // Clear the mutation rate input
    } catch (error) {
      console.error("Error adding gene:", error);
    }
  };


  // Function to handle modifying a gene's activity
  const handleModifyGene = async () => {
    try {
      const updatedGene = await modifyGene(modifyGeneId, modifyGeneImpact);
      setGenesData(
        genesData.map((gene) =>
          gene.id === modifyGeneId ? updatedGene : gene
        )
      ); // Update the modified gene in the genesData state
      setModifyGeneId(""); // Clear the input
      setModifyGeneImpact(0); // Clear the input
      console.log("Gene modified:", updatedGene);
    } catch (error) {
      console.error("Error modifying gene:", error);
    }
  };

  return (
    <main style={{ padding: "20px" }}>
      <h1>VitalCore Dashboard</h1>
      <p>Analyze data and simulate life factor effects.</p>
      <button onClick={updateLifespan}>Simulate 10% Increase</button>

      {/* Add Gene Form */}
      <div>
        <h2>Add a New Gene</h2>
        <input
          type="text"
          placeholder="Gene Name"
          value={newGeneName}
          onChange={(e) => setNewGeneName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Impact on Lifespan"
          value={newGeneImpact}
          onChange={(e) => setNewGeneImpact(Number(e.target.value))}
        />
        <button onClick={handleAddGene}>Add Gene</button>
      </div>

      {/* Modify Gene Activity Form */}
      {/* Modify Gene Activity Form */}
      <div>
        <h2>Modify Gene Activity</h2>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="modifyGeneId">Gene ID</label>
          <input
            id="modifyGeneId"
            type="text"
            placeholder="Gene ID"
            value={modifyGeneId}
            onChange={(e) => setModifyGeneId(e.target.value)}
            style={{ marginLeft: "10px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="modifyGeneImpact">New Impact on Lifespan</label>
          <input
            id="modifyGeneImpact"
            type="number"
            placeholder="New impact"
            value={modifyGeneImpact}
            onChange={(e) => setModifyGeneImpact(Number(e.target.value))}
            style={{ marginLeft: "10px" }}
          />
        </div>
        <button onClick={handleModifyGene}>Modify Gene</button>
      </div>

      {/* Dashboard and Charts */}
      <Dashboard lifespanData={adjustedLifespan} />
      <Chart lifespanData={adjustedLifespan} />
      <PopulationEffectsChart populationData={populationData} />
      <AgingTrendsChart lifespanData={adjustedLifespan} />
    </main>
  );
}
