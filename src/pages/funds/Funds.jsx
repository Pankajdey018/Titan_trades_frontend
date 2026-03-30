import React, { useMemo, useState } from "react";
import "./funds.css";

import { useTrading } from "../../context/TradingContext.jsx";

const formatINR = (num) =>
  Number(num || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const DataRow = ({ label, value, highlight }) => (
  <div className={`data-row ${highlight ? "highlight" : ""}`}>
    <span>{label}</span>
    <span>Rs {formatINR(value)}</span>
  </div>
);

const Section = ({ title, children }) => (
  <div className="card">
    <div className="card-header">{title}</div>
    <div className="card-body">{children}</div>
  </div>
);

const Funds = () => {
  const { user, addFunds, withdrawFunds, pushToast } = useTrading();
  const [addAmount, setAddAmount] = useState(1000);
  const [withdrawAmount, setWithdrawAmount] = useState(500);

  const funds = useMemo(() => {
    const balance = Number(user?.balance || 0);
    const invested = Number(user?.portfolio?.invested || 0);

    return {
      availableMargin: balance,
      usedMargin: invested,
      availableCash: balance,
      openingBalance: user?.openingBalance || 0,
      currentValue: user?.portfolio?.currentValue || 0,
      equity: user?.portfolio?.equity || balance,
      pnl: user?.portfolio?.pnl || 0,
      todayPnl: user?.portfolio?.todayPnl || 0,
    };
  }, [user]);

  const handleAddFunds = async () => {
    try {
      await addFunds(Number(addAmount));
    } catch (error) {
      pushToast(error?.response?.data?.message || "Unable to add funds", "error");
    }
  };

  const handleWithdraw = async () => {
    try {
      await withdrawFunds(Number(withdrawAmount));
    } catch (error) {
      pushToast(error?.response?.data?.message || "Unable to withdraw funds", "error");
    }
  };

  return (
    <div className="funds-page">
      <div className="funds-banner">
        <p>Simulation wallet for paper trading funds.</p>
        <div className="funds-actions">
          <div className="funds-action-group">
            <input
              type="number"
              min="1"
              value={addAmount}
              onChange={(e) => setAddAmount(e.target.value)}
            />
            <button className="funds-btn funds-btn-primary" onClick={handleAddFunds}>
              Add funds
            </button>
          </div>

          <div className="funds-action-group">
            <input
              type="number"
              min="1"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
            />
            <button className="funds-btn funds-btn-secondary" onClick={handleWithdraw}>
              Withdraw
            </button>
          </div>
        </div>
      </div>

      <div className="grid">
        <Section title="Funds Overview">
          <DataRow label="Available margin" value={funds.availableMargin} highlight />
          <DataRow label="Used margin" value={funds.usedMargin} />
          <DataRow label="Available cash" value={funds.availableCash} />

          <hr />

          <DataRow label="Opening balance" value={funds.openingBalance} />
          <DataRow label="Portfolio value" value={funds.currentValue} />
          <DataRow label="Total equity" value={funds.equity} />
          <DataRow label="Total P&L" value={funds.pnl} />
          <DataRow label="Today's P&L" value={funds.todayPnl} />
        </Section>

        <div className="card empty-card">
          <p>All funds here are virtual and safe for strategy testing.</p>
        </div>
      </div>
    </div>
  );
};

export default Funds;
