"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */
import Chart from "./components/Chart";
import Dashboard from "./components/Dashboard";
import PopulationEffectsChart from "./components/PopulationEffectsChart";
import AgingTrendsChart from "./components/AgingTrendsChart";
import { useState, useEffect,useRef } from "react";
import { getGenes, addGene, modifyGene } from "./graphql"; // Assuming these functions are moved to a separate file
import {io} from "socket.io-client"; // Import socket.io-client
import Login from './components/Login';
import Signup from './components/Signup';


const socket = io("https://vitalcore.onrender.com");
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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const lifespanDataRef = useRef<number[]>([]);
  console.log("Is  Authenticated:", isAuthenticated,isAuthenticated);
  // Fetch data using useEffect
  // Update the ref whenever `lifespanData` changes
  useEffect(() => {
    lifespanDataRef.current = lifespanData;
  }, [lifespanData]);

  useEffect(() => {
    async function fetchCellData() {
      socket.on('connect', () => {
        console.log('Socket connected');
      });



      socket.on("lifespanUpdated", (newLifespan: number[]) => {
        console.log("Received lifespan update from server:", newLifespan);
        setLifespanData(newLifespan);
        setPopulationData(calculatePopulation(newLifespan));
        setAdjustedLifespan(newLifespan);
      });


      socket.on("geneAdded", (newGene: Gene) => {
        console.log("Received new gene addition:", newGene);

        // Update genes state and recalculate adjusted lifespan
        setGenesData((prevGenes) => {
          const updatedGenes = [...prevGenes, newGene];
          console.log("Updated genes:", updatedGenes);

          // Use the ref to get the latest `lifespanData`
          const adjusted = applyGeneEffects(lifespanDataRef.current, updatedGenes);
          console.log("Adjusted lifespan:", adjusted);

          // Update the lifespan data for the chart
          setAdjustedLifespan(adjusted);

          return updatedGenes; // Return the updated genes list
        });
      });

      socket.on("geneModified", (updatedGene: Gene) => {
        console.log("Received gene modification:", updatedGene);

        // Update the gene in the state by its ID
        setGenesData((prevGenes) =>{
          const updatedGenes = prevGenes.map((gene) =>
            gene.id === updatedGene.id ? updatedGene : gene
          )
          const adjusted = applyGeneEffects(lifespanDataRef.current, updatedGenes);
          console.log("Adjusted lifespan:", adjusted);

          // Update the lifespan data for the chart
          setAdjustedLifespan(adjusted);
          return updatedGenes;
        }

        );


      });


      socket.on('disconnect', () => {
        console.log('Socket disconnected');
      });
      try {
        // Fetch cells data
        const response = await fetch("https://vitalcore.onrender.com/cells");
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
    // const socket = io("http://localhost:5000"); // Connect to the backend server



    return () => {
      socket.off("lifespanUpdated"); // Clean up the socket event listener on component unmount
      socket.off("geneAdded");
      socket.off("geneModified");
      socket.disconnect();
    };
  }, []);

  const applyGeneEffects = (lifespan: number[], genes: Gene[]) => {
    console.log(139,"lifespan",lifespan,"genes",genes)
    return lifespan.map((life) => {
      console.log("life ",life)
      let geneEffect = 0;
      genes.forEach((gene) => {
        // console.log("gene ",gene)
        geneEffect += gene.impact_on_lifespan;
      });
      return Math.round(life + life * geneEffect);
    });
  };

  const updateLifespan = async () => {
    const updatedLifespan = lifespanData.map((value) => value * 1.1);

    try {
      const response = await fetch("https://vitalcore.onrender.com", {
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
      // Modify the gene using the modifyGene function
      const updatedGene = await modifyGene(modifyGeneId, modifyGeneImpact);

      // Update the genesData state with the modified gene
      const updatedGenes = genesData.map((gene) =>
        gene.id === modifyGeneId ? updatedGene : gene
      );

      setGenesData(updatedGenes); // Update the modified gene in the genesData state

      // Apply the gene effects on the updated genes data using lifespanDataRef
      const adjusted = applyGeneEffects(lifespanDataRef.current, updatedGenes);
      console.log("Adjusted lifespan:", adjusted);

      // Update the lifespan data for the chart
      setAdjustedLifespan(adjusted);

      // Clear the input fields
      setModifyGeneId(""); // Clear the input for gene ID
      setModifyGeneImpact(0); // Clear the input for gene impact
      console.log("Gene modified:", updatedGene);
    } catch (error) {
      console.error("Error modifying gene:", error);
    }
  };
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8" style={{ padding: "20px" }}>
      {
          isAuthenticated?(
            <>
              <h1>Dashboard</h1>
            </>
          ):(
            <div className="w-full max-w-md mx-auto">
              <h1>Signin</h1>
          </div>
          )
        }


    </main>
  );
}