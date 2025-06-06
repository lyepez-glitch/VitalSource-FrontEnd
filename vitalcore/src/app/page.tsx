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
import Sidebar from './components/Sidebar';
import Simulate from './components/Simulate';
import AddNewGene from './components/AddNewGene';
import UpdateGene from './components/UpdateGene';
// const backendUrl = process.env.NEXT_PUBLIC_RENDER_URL;

const backendUrl = "https://vitalcore.onrender.com";
console.log('backendurl ',backendUrl);

const socket = io(backendUrl);
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
  const [signUp, setSignUp] = useState<boolean>(false);
  const [logIn, setLogIn] = useState<boolean>(false);
  const [creds, setCreds] = useState<boolean>(true);
  const lifespanDataRef = useRef<number[]>([]);
  const [simulate,setSimulate] = useState<boolean>(false);
  const [addNewGene,setAddNewGene] = useState<boolean>(false);
  const [newGeneSuccess,setNewGeneSuccess] = useState<boolean>(false);
  const [modifyGeneSuccess,setModifyGeneSuccess] = useState<boolean>(false);
  const [updateGene,setUpdateGene] = useState<boolean>(false);

  // Fetch data using useEffect
  // Update the ref whenever `lifespanData` changes

  // useEffect(()=>{
  //   if(isAuthenticated){
  //     const timer = setTimeout(()=>{

  //     },2000)
  //     return () => clearTimeout(timer);
  //   }
  // },[isAuthenticated])

  useEffect(() => {
    lifespanDataRef.current = lifespanData;
  }, [lifespanData]);

  useEffect(() => {
    async function fetchCellData() {
      socket.on('connect', () => {
        console.log('Socket connected');
      });



      socket.on("lifespanUpdated", (newLifespan: number[]) => {

        setLifespanData(newLifespan);
        setPopulationData(calculatePopulation(newLifespan));
        setAdjustedLifespan(newLifespan);
      });


      socket.on("geneAdded", (newGene: Gene) => {


        // Update genes state and recalculate adjusted lifespan
        setGenesData((prevGenes) => {
          const updatedGenes = [...prevGenes, newGene];


          // Use the ref to get the latest `lifespanData`
          const adjusted = applyGeneEffects(lifespanDataRef.current, updatedGenes);


          // Update the lifespan data for the chart
          setAdjustedLifespan(adjusted);

          return updatedGenes; // Return the updated genes list
        });
      });

      socket.on("geneModified", (updatedGene: Gene) => {


        // Update the gene in the state by its ID
        setGenesData((prevGenes) =>{
          const updatedGenes = prevGenes.map((gene) =>
            gene.id === updatedGene.id ? updatedGene : gene
          )
          const adjusted = applyGeneEffects(lifespanDataRef.current, updatedGenes);


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
        const response = await fetch(`${backendUrl}/cells`);
        const data = await response.json();


        // Fetch genes data via GraphQL
        const genesResponse = await getGenes();


        setGenesData(genesResponse); // Set the genesData directly from the response

        // Combine data
        const adjusted = applyGeneEffects(data.lifespan, genesResponse); // Apply gene effects

        setAdjustedLifespan(adjusted);

        if (data.lifespan && Array.isArray(data.lifespan)) {
          setLifespanData(data.lifespan);
          setPopulationData(calculatePopulation(data.lifespan));
        } else {
          console.error("Unexpected API response format.");
        }
      } catch (error) {
        console.error("Error fetching cell data:");
      }
    }

    fetchCellData();




    return () => {
      socket.off("lifespanUpdated"); // Clean up the socket event listener on component unmount
      socket.off("geneAdded");
      socket.off("geneModified");
      socket.disconnect();
    };
  }, []);

  const handleBackBtn = (e: React.MouseEvent<HTMLButtonElement>) => {
      console.log("Back btn clicked");
      setSignUp(false);
      setLogIn(false);
      setCreds(true);
  };

  const handleSignUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log("SignUp clicked");
    setSignUp(true);
    setLogIn(false);
    setCreds(false);
  };
  const handleLogIn = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log("LogIn clicked");
    setSignUp(false);
    setLogIn(true);
    setCreds(false);
  };

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
    console.log('update lifespan',lifespanData);
    const updatedLifespan = lifespanData.map((value) => value * 1.1);

    try {
      const response = await fetch(`${backendUrl}/cells`, {
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
      console.error("Error updating lifespan data:");
    }
  };

  // Function to handle adding a new gene
  const handleAddGene = async () => {
    try {
      const newGene = await addGene(newGeneName, newGeneMutationRate, newGeneImpact); // Provide all 3 arguments
      console.log('new gene',newGene);
      setGenesData([...genesData, newGene]); // Add the new gene to the genesData state
      setNewGeneName(""); // Clear the input
      setNewGeneImpact(0); // Clear the input
      setNewGeneMutationRate(0); // Clear the mutation rate input
      setNewGeneSuccess(true);
    } catch (error) {
      console.error("Error adding gene:");
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


      // Update the lifespan data for the chart
      setAdjustedLifespan(adjusted);

      // Clear the input fields
      setModifyGeneId(""); // Clear the input for gene ID
      setModifyGeneImpact(0); // Clear the input for gene impact
      setModifyGeneSuccess(true);

    } catch (error) {
      console.error("Error modifying gene:");
    }
  };
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };
  const handleSimClick = () => {
    console.log('handle sim click');
    setSimulate(true);
    setAddNewGene(false);
    setUpdateGene(false);
  };
  const handleAddGeneClick = () => {
    console.log('handle add gene click');
    setAddNewGene(true);
    setSimulate(false);
    setUpdateGene(false);
  };

  const handleUpdateGeneClick = () => {
    console.log('handle update gene click');
    setUpdateGene(true);
    setAddNewGene(false);
    setSimulate(false);
  };

  return (
    <main className="main min-h-screen bg-gray-50 p-8" style={{ padding: "20px" }}>

      {
          isAuthenticated?(

            <>
            <Sidebar handleAddGeneClick={handleAddGeneClick} handleUpdateGeneClick={handleUpdateGeneClick} handleSimClick={handleSimClick}/>
            {
              simulate?(
                <Simulate updateLifespan={updateLifespan} populationData={populationData} adjustedLifespan={adjustedLifespan}/>
              ):(
                <></>
              )
            }
            {
              addNewGene?(
                <AddNewGene newGeneSuccess={newGeneSuccess} handleAddGene={handleAddGene} setNewGeneName={setNewGeneName} setNewGeneImpact={setNewGeneImpact} newGeneImpact={newGeneImpact} newGeneName={newGeneName}/>
              ):(
                <></>
              )
            }
            {
              updateGene?(
              <UpdateGene modifyGeneId={modifyGeneId}setModifyGeneId={setModifyGeneId} modifyGeneImpact={modifyGeneImpact} setModifyGeneImpact={setModifyGeneImpact} handleModifyGene={handleModifyGene} modifyGeneSuccess={modifyGeneSuccess}/>

              ):(
              <></>
            )
            }









            </>
          ):(


            <>
              {
                creds?(
                  <div className="credsContainer w-full max-w-md mx-auto">
                    <div className="signup"><button onClick={handleSignUp}>SignUp</button></div>
                    <div className="divider"></div>
                    <div className="login"><button onClick={handleLogIn}>LogIn</button></div>
                  </div>
                ):(
                <>
                  {
                    signUp?(
                      <Signup  handleLogIn={ handleLogIn} handleBackBtn={handleBackBtn} />
                    ):(
                      <></>
                    )
                  }

                  {
                    logIn?(
                      <>
                      {/* <h1 className="text-3xl font-semibold text-center mb-8">Login to VitalCore</h1> */}
                      <Login handleBackBtn={handleBackBtn} onLoginSuccess={handleLoginSuccess} />
                      </>
                    ):(
                      <></>
                    )
                  }

              </>)
              }
            </>



          )
        }


    </main>
  );
}