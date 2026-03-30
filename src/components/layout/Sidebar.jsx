import React, { useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./layout.css";

import {
  Dashboard,
  ListAlt,
  AccountBalance,
  ShowChart,
  AccountBalanceWallet,
  Apps,
} from "@mui/icons-material";
import { setAuthToken } from "../../services/apiClient";
import { useTrading } from "../../context/TradingContext.jsx";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: <Dashboard /> },
  { name: "Orders", path: "/dashboard/orders", icon: <ListAlt /> },
  { name: "Holdings", path: "/dashboard/holdings", icon: <AccountBalance /> },
  { name: "Positions", path: "/dashboard/positions", icon: <ShowChart /> },
  { name: "Funds", path: "/dashboard/funds", icon: <AccountBalanceWallet /> },
  { name: "Apps", path: "/dashboard/apps", icon: <Apps /> },
];

const formatInr = (value) =>
  Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });

const Sidebar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useTrading();

  const initials = useMemo(() => {
    const name = user?.name || "Trader";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [user?.name]);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUserName");
    setAuthToken(null);
    navigate("/login", { replace: true });
  };

  return (
    <div className="sidebar">
      <div className="logo brand-lockup">
        <span className="brand-mark">TT</span>
        <div className="brand-copy">
          <span className="brand-kicker">Market Terminal</span>
          <span className="brand-name">Titan Trades</span>
        </div>
      </div>

      <ul className="menu-list">
        {menuItems.map((item) => (
          <li key={item.name}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                isActive ? "menu-item active" : "menu-item"
              }
              end={item.path === "/dashboard"}
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="profile-section">
        {isProfileOpen && (
          <div className="profile-panel">
            <h4>Profile</h4>
            <p className="profile-name">{user?.name || "Trader"}</p>
            <p className="profile-id">Account: {user?.id || "SIM-001"}</p>

            <div className="profile-metrics">
              <div>
                <span>Cash</span>
                <strong>Rs {formatInr(user?.balance)}</strong>
              </div>
              <div>
                <span>P&L</span>
                <strong className={Number(user?.portfolio?.pnl || 0) >= 0 ? "positive" : "negative"}>
                  Rs {formatInr(user?.portfolio?.pnl)}
                </strong>
              </div>
            </div>

            <button type="button" className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}

        <button
          type="button"
          className="profile profile-toggle"
          onClick={() => setIsProfileOpen((prev) => !prev)}
        >
          <div className="avatar">{initials}</div>
          <div className="profile-summary">
            <p>{user?.name || "TRADER"}</p>
            <span>View profile</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
