import React from "react";

import Summary from "../pages/Summary.jsx";
import Orders from "../pages/Orders.jsx";
import Holdings from "../pages/holdings/Holdings.jsx";
import Positions from "../pages/position/Positions.jsx";
import Funds from "../pages/funds/Funds.jsx";
import Apps from "../pages/Apps.jsx";

export const dashboardRoutes = [
  { path: "", element: <Summary /> },
  { path: "orders", element: <Orders /> },
  { path: "holdings", element: <Holdings /> },
  { path: "positions", element: <Positions /> },
  { path: "funds", element: <Funds /> },
  { path: "apps", element: <Apps /> },
];
