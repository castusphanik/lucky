import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Title,
} from "chart.js";
import "./styles.scss";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Title);

interface TrailerPMData {
  labels: string[];
  values: string[]; // e.g., ["9 Units", "0 Units", "2 Units"]
}

interface Props {
  data: TrailerPMData;
}

function TrailerPmCompliance({ data }: Props) {
  // Parse numeric values from string (e.g., "9 Units" → 9)
  const numericValues = data.values.map((val) =>
    parseInt(val.replace(/[^\d]/g, ""))
  );

  const totalUnits = numericValues.reduce((sum, val) => sum + val, 0);
  const compliantUnits = numericValues[numericValues.length - 1]; // Assuming last item is compliant
  const compliancePercentage = totalUnits
    ? Math.round((compliantUnits / totalUnits) * 100)
    : 0;

  // Chart.js data and config
  const chartData = {
    labels: [""],
    datasets: [
            {
        label: "Compliant",
        data: [compliancePercentage],
        backgroundColor: "#1e3a8a", // dark blue
        stack: "stack1",
      },
      {
        label: "Non-Compliant",
        data: [100 - compliancePercentage],
        backgroundColor: "#818cf8", // light blue
        stack: "stack1",
      },
    ],
  };

const chartOptions = {
  indexAxis: "x" as const, // vertical bar
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: { display: false, stacked: true },
    y: { display: false, stacked: true },
  },
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false },
  },
};


  return (
    <>
      <div className="content">
  <div className="chartWrapper">
    <Bar data={chartData} options={chartOptions} />
  </div>
  <div className="textInfo">
    {data.labels.map((label, i) => (
      <div className="infoRow" key={i}>
        <span className="label">{label}</span>
        <span className="value">{data.values[i]}</span>
      </div>
    ))}
    <div className="compliance">
      <strong>{compliancePercentage}% - Compliant</strong>
    </div>
    <a href="#" className="expandLink">
      Expand to view details
    </a>
  </div>
</div>
    </>
  );
}
export default TrailerPmCompliance;
