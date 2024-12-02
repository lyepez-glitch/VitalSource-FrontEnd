import React from "react";

type LifespanTableProps = {
  lifespanData: number[]; // This is now just an array of numbers
};

const LifespanTable: React.FC<LifespanTableProps> = ({ lifespanData }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">
              Cell ID
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">
              Lifespan
            </th>
          </tr>
        </thead>
        <tbody>
          {lifespanData.map((lifespan, index) => (
            <tr
              key={index}
              className={`${index % 2 === 0 ? "bg-white" : "bg-gray-100"}`}
            >
              <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
              <td className="border border-gray-300 px-4 py-2">{lifespan}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LifespanTable;
