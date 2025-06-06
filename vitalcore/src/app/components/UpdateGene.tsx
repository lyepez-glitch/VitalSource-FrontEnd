// import React, { useState,useEffect } from 'react';



type Props = {
  modifyGeneId: string;
  setModifyGeneId: React.Dispatch<React.SetStateAction<string>>;
  modifyGeneImpact: number;
  setModifyGeneImpact: React.Dispatch<React.SetStateAction<number>>;
  handleModifyGene:()=>void;
  modifyGeneSuccess: boolean;

}

const UpdateGene: React.FC<Props> = ({modifyGeneId,setModifyGeneId,modifyGeneImpact,setModifyGeneImpact,handleModifyGene,modifyGeneSuccess}) => {

  return (

        <div className="modifyGeneForm mt-8 mx-auto max-w-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Modify Gene Activity</h2>
          <div className="flex gap-4 mb-4" style={{ marginBottom: "10px" }}>
            {/* <label htmlFor="modifyGeneId">Gene ID</label> */}
            <input
              id="modifyGeneId"
              type="text"
              placeholder="Gene ID"
              value={modifyGeneId}
              onChange={(e) => setModifyGeneId(e.target.value)}
              style={{ marginLeft: "10px" }}
              className="border rounded px-4 py-2 w-full"
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            {/* <label htmlFor="modifyGeneImpact">New Impact on Lifespan</label> */}
            <input
              id="modifyGeneImpact"
              type="number"
              placeholder="New impact"
              value={modifyGeneImpact === 0 ? '' : modifyGeneImpact}
              onChange={(e) => setModifyGeneImpact(Number(e.target.value))}
              style={{ marginLeft: "10px" }}
              className="border rounded px-4 py-2 w-full"
            />
          </div>
          {modifyGeneSuccess && <div style={{flex: '1 1 100%'}} className="success">Updated gene successfully!</div>}
          <button onClick={handleModifyGene}
          className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
          >
            Modify Gene</button>
        </div>

  );
};

export default UpdateGene;
