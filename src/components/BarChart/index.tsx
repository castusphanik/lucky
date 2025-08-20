import React from "react";
import { Chart as ChartJS } from "chart.js/auto";

import { Bar } from "react-chartjs-2";
import  "./styles.scss";

import sourceData from "../../data/AvgCostByVMRS.json";

const getChartOptions = () => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Hide legend to match your image
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 1200,
        ticks: {
          stepSize: 800,
          font: {
            size: 13
          },
          callback: function(value: number | string) {
            return `$${value}`
            // return value.toString(); // Removes comma formatting
          }
        },
        grid: {
          display: false, // or color: 'transparent'
        },
        border: {
          color: '#4e4b4bff', // Axis line color
          width: 1, // Thickness in pixels (height of the line)
        }
      },
      x: {
        ticks: {
          font: {
            size: 13
          },
          maxRotation: 45,
          minRotation: 45
        },
        grid: {
          display: false
        },
        border: {
          color: '#4e4b4bff', // Axis line color
          width: 1, // Thickness in pixels (height of the line)
        }
      }
    }
  };
};

export default function BarChart() {
  return (
    // <div className="barChartContainerMain">
      <div className="barChartMain">
        <Bar
          data={{
            labels: sourceData.map((data) => data.label),
            datasets: [
              {
                label: "Count",
                data: sourceData.map((data) => data.value),
                backgroundColor: [
                  "#141c50", // Dark blue for Doors respectively for all
                  "#3f51b5",
                  "#9fa8da",
                  "#3f51b5",
                  "#9fa8da",
                  "#141c50",
                  "#3f51b5",
                ],
                // borderColor: ["", "",  array of strings] and borderWidth: 2 (num)
                barPercentage: 0.6,
                categoryPercentage: 1

              },
            ],
          }}
          options={getChartOptions()}

        />
      </div>
    // </div>
  );
}
