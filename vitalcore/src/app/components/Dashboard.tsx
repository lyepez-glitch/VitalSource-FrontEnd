import React from "react";
import LifespanTable from "./LifespanTable";

type DashboardProps = {
  lifespanData: number[]; // Expecting an array of numbers passed down from Home
};

const Dashboard: React.FC<DashboardProps> = ({ lifespanData }) => {

  return (
    <div className="dashboard max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Cell Lifespan Dashboard</h1>
      <div className="mb-6">
        {/* You can still pass lifespanData directly to LifespanTable */}
        <LifespanTable lifespanData={lifespanData} />
      </div>
    </div>
  );
};

export default Dashboard;
