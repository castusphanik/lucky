import React from "react";
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import classes from "./style.module.css";

import sourceData from "../../data/RepairCountByVMRS.json";

const getChartOptions = () => {
  return {
    indexAxis: "y" as const, // This makes the bars horizontal
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
      x: {
        // Now x is the value axis (was y in vertical chart)
        beginAtZero: true,
        max: 25,
        ticks: {
          stepSize: 5,
          font: {
            size: 13,
          },
          callback: function (value: number | string) {
            return value.toString();
          },
        },
        grid: {
          display: false,
        },
        border: {
          color: "#4e4b4bff",
          width: 1,
        },
      },
      y: {
        // Now y is the category axis (was x in vertical chart)
        ticks: {
          font: {
            size: 13,
          },
          // Remove rotation since labels will be on the y-axis
        },
        grid: {
          display: false,
        },
        border: {
          color: "#4e4b4bff",
          width: 1,
        },
      },
    },
  };
};

export default function HorizontalBarChart() {
  return (
    <div className={classes.horizontalbarChartContainer}>
      <div className={classes.horizontalbarChart}>
        <Bar
          data={{
            labels: sourceData.map((data) => data.label),
            datasets: [
              {
                label: "Count",
                data: sourceData.map((data) => data.value),
                backgroundColor: [
                  "#3f51b5",
                  "#141c50",
                  "#3a49aaff",
                  "#333f85ff",
                  "#697ef7ff",
                  "#304ceaff",
                ],
                barPercentage: 0.6,
                categoryPercentage: 1,
              },
            ],
          }}
          options={getChartOptions()}
        />
      </div>
    </div>
  );
}
