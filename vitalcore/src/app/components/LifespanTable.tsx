import React from "react";

type LifespanTableProps = {
  lifespanData: number[]; // This is now just an array of numbers
};

const LifespanTable: React.FC<LifespanTableProps> = ({ lifespanData }) => {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th style={{ border: "1px solid black", padding: "8px" }}>Cell ID</th>
          <th style={{ border: "1px solid black", padding: "8px" }}>Lifespan</th>
        </tr>
      </thead>
      <tbody>
        {lifespanData.map((lifespan, index) => (
          <tr key={index}>
            <td style={{ border: "1px solid black", padding: "8px" }}>{index + 1}</td> {/* Assuming index + 1 as cell ID */}
            <td style={{ border: "1px solid black", padding: "8px" }}>{lifespan}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default LifespanTable;
