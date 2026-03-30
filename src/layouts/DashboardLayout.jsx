import React from "react";
import Sidebar from "../components/layout/Sidebar";
import TopBar from "../components/layout/TopBar";
import AppFooter from "../components/layout/AppFooter";
import "../components/layout/layout.css";
import "../components/layout/layout.overrides.css";

const DashboardLayout = ({ children }) => {
  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Section */}
      <div className="main-content">
        <TopBar />

        <div className="page-content">
          {children}
          <AppFooter variant="dashboard" />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
