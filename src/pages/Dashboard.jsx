import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import { GeneralContextProvider } from "../context/GeneralContext";
import DashboardLayout from "../layouts/DashboardLayout";
import { dashboardRoutes } from "../routes/DashboardRoutes.jsx";

const Dashboard = () => {
  return (
    <GeneralContextProvider>
      <DashboardLayout>
        <Suspense fallback={<div className="p-4">Loading...</div>}>
          <Routes>
            {dashboardRoutes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
          </Routes>
        </Suspense>
      </DashboardLayout>
    </GeneralContextProvider>
  );
};

export default Dashboard;