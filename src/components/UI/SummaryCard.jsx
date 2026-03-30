import React from "react";

const SummaryCard = ({ title, value, subtitle, extra, profit }) => {
  return (
    <div className="card">
      <p className="card-title">{title}</p>

      <h2 className={`card-value ${profit ? "profit" : ""}`}>
        <span>{value}</span>
        {extra && <small className="card-extra">{extra}</small>}
      </h2>

      <p className="card-subtitle">{subtitle}</p>
    </div>
  );
};

export default SummaryCard;
