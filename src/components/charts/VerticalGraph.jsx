import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { baseOptions } from "../theme/chartConfig.js";
import { chartTheme } from "../theme/theme.js";
import "./VerticalGraph.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const formatCompactCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(Number(value || 0));

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

export function VerticalGraph({ data, title }) {
  const labels = Array.isArray(data?.labels) ? data.labels : [];
  const sourceDataset = data?.datasets?.[0] || {};

  const dataset = {
    ...sourceDataset,
    borderRadius: 12,
    borderSkipped: false,
    maxBarThickness: 34,
    categoryPercentage: 0.62,
    barPercentage: 0.78,
    backgroundColor: (context) => {
      const { chart } = context;
      const { ctx, chartArea } = chart;

      if (!chartArea) return chartTheme.colors[0];

      const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
      gradient.addColorStop(0, "rgba(37, 99, 235, 0.88)");
      gradient.addColorStop(0.55, "rgba(59, 130, 246, 0.72)");
      gradient.addColorStop(1, "rgba(125, 211, 252, 0.96)");
      return gradient;
    },
    hoverBackgroundColor: "#1d4ed8",
  };

  const options = {
    ...baseOptions,
    layout: {
      padding: {
        top: 12,
        right: 8,
        left: 8,
        bottom: 0,
      },
    },
    plugins: {
      ...baseOptions.plugins,
      title: {
        display: false,
      },
      legend: {
        display: false,
      },
      tooltip: {
        ...baseOptions.plugins.tooltip,
        callbacks: {
          title: (items) => items?.[0]?.label || "Value",
          label: (ctx) => `${sourceDataset.label || "Value"}: ${formatCurrency(ctx.raw)}`,
          afterLabel: (ctx) => `Bar size: ${formatCompactCurrency(ctx.raw)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false, drawBorder: false },
        border: {
          display: false,
        },
        ticks: {
          color: chartTheme.text,
          font: { size: 11, weight: "600" },
          maxRotation: 0,
          autoSkip: labels.length > 8,
          maxTicksLimit: 8,
        },
      },
      y: {
        grid: {
          color: chartTheme.grid,
          drawBorder: false,
          tickLength: 0,
        },
        border: {
          display: false,
        },
        ticks: {
          color: chartTheme.text,
          font: { size: 11 },
          padding: 10,
          callback: (val) => formatCompactCurrency(val),
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <section className="vertical-graph-card">
      <div className="vertical-graph-header">
        <div>
          <p className="vertical-graph-kicker">Analytics</p>
          <h3>{title || sourceDataset.label || "Portfolio performance"}</h3>
        </div>
        <span className="vertical-graph-meta">{labels.length} data points</span>
      </div>

      <div className="vertical-graph-canvas">
        <Bar
          options={options}
          data={{
            labels,
            datasets: [dataset],
          }}
        />
      </div>
    </section>
  );
}
