import React from "react";
import PositionRow from "./PositionRow";

const PositionsTable = ({ data }) => {
  return (
    <table className="positions-table">
      <thead>
        <tr>
          <th>Product</th>
          <th>Instrument</th>
          <th>Qty</th>
          <th>Avg</th>
          <th>LTP</th>
          <th>P&L</th>
          <th>Chg</th>
        </tr>
      </thead>

      <tbody>
        {data.map((stock) => (
          <PositionRow key={stock.symbol || stock.name} stock={stock} />
        ))}
      </tbody>
    </table>
  );
};

export default PositionsTable;
