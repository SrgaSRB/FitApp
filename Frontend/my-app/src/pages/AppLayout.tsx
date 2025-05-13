import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";

const AppLayout: React.FC = () => {
  return (
    <>
      <Navbar />
      <div className="body">
        <Outlet />
      </div>
    </>
  );
};

export default AppLayout;
