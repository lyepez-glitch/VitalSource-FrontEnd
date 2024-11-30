import React from "react";
import LifespanTable from "./LifespanTable";

type DashboardProps = {
  lifespanData: number[]; // Expecting an array of numbers passed down from Home
};

const Dashboard: React.FC<DashboardProps> = ({ lifespanData }) => {
  return (
    <div>
      <h1>Cell Lifespan Dashboard</h1>
      <div style={{ marginBottom: "20px" }}>
        {/* You can still pass lifespanData directly to LifespanTable */}
        <LifespanTable lifespanData={lifespanData} />
      </div>
    </div>
  );
};

export default Dashboard;
