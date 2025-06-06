// import React, { useState,useEffect } from 'react';


type Props = {
  setNewGeneName:(name:string)=> void;
  setNewGeneImpact:(impact:number)=> void;
  handleAddGene:()=>void;
  newGeneName: string;
  newGeneImpact:number;
  newGeneSuccess: boolean;
}

const AddNewGene: React.FC<Props> = ({setNewGeneName,setNewGeneImpact,handleAddGene,newGeneName,newGeneImpact,newGeneSuccess}) => {




  return (

      <div className="addGeneCont mx-auto max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Add a New Gene</h2>
        <input
          type="text"
          placeholder="Gene Name"
          value={newGeneName}
          onChange={(e) => setNewGeneName(e.target.value)}
          className="border rounded px-4 py-2 w-full mb-4"
        />
        <input
          type="text"
          placeholder="Impact on Lifespan"
          value={newGeneImpact === 0 ? '' : newGeneImpact}
          onChange={(e) => setNewGeneImpact(Number(e.target.value))}
          className="border rounded px-4 py-2 w-full mb-4"

        />
        {newGeneSuccess && <div style={{flex:'1'}} className="success">Added gene successfully!</div>}
        <button onClick={handleAddGene}className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full">Add Gene</button>
      </div>
  );
};

export default AddNewGene;
