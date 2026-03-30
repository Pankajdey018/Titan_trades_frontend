import React from "react";
import HoldingsRow from "./HoldingsRow";

const HoldingsTable = ({ data }) => {
  return (
    <table className="holdings-table">
      <thead>
        <tr>
          <th>Instrument</th>
          <th>Qty</th>
          <th>Avg</th>
          <th>LTP</th>
          <th>Value</th>
          <th>P&L</th>
          <th>Net</th>
          <th>Day</th>
        </tr>
      </thead>

      <tbody>
        {data.map((stock) => (
          <HoldingsRow key={stock.symbol || stock.name} stock={stock} />
        ))}
      </tbody>
    </table>
  );
};

export default HoldingsTable;
