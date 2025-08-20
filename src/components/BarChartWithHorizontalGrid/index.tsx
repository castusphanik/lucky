import React from "react";
import { Bar } from "react-chartjs-2";
import  "./styles.scss";

interface BarChartProps {
  data: Record<string, any>[];
  labelKey: string;
  valueKey: string;
}

export default function BarChartWithHorizontalGrid({
  data,
  labelKey,
  valueKey,
}: BarChartProps) {
  return (
    <div className="barChartContainerHorizontal">
      <div className="barChartHorizontal">
        <Bar
          data={{
            labels: data.map((item) => item[labelKey]),
            datasets: [
              {
                data: data.map((item) => item[valueKey]),
                backgroundColor: [
                  "#1e40af", "#3b82f6", "#1e40af",
                  "#1e3a8a", "#1e3a8a", "#3b82f6"
                ],
                borderColor: "transparent",
                borderWidth: 0,
                borderRadius: 2,
                borderSkipped: false,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
              title: {
                display: false,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 2000,
                  font: { size: 12 },
                  callback: function (value: string | number) {
                    if (typeof value === "string") {
                      value = parseFloat(value);
                    }
                    return `$${value / 1000}k`;
                  },
                },
                grid: {
                  display: true,
                  color: "#d1d5db",
                  lineWidth: 1,
                },
                border: {
                  color: "#6b7280",
                  width: 1,
                },
              },
              x: {
                ticks: {
                  font: { size: 12 },
                  maxRotation: 45,
                  minRotation: 45,
                },
                grid: { display: false },
                border: {
                  color: "#6b7280",
                  width: 1,
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
}


