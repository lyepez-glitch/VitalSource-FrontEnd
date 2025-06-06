import React from 'react';

interface SidebarProps {
  handleSimClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleAddGeneClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleUpdateGeneClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  handleSimClick,handleAddGeneClick,handleUpdateGeneClick
}) => {
  return (
    <div className="asideContainer">
      <aside className="aside">
        <ul className="nav">
          <li className="userBtn">
            <button onClick={handleSimClick} className="nav-item">
              Simulation
            </button>
          </li>
            <li><button onClick={handleAddGeneClick} className="nav-item">
              Add New Gene
            </button>
          </li>
          <li>
          <button onClick={handleUpdateGeneClick} className="nav-item">
              Update Gene
          </button>
          </li>


        </ul>
      </aside>
    </div>
  );
};

export default Sidebar;
