import React from 'react';
import { Doughnut } from "react-chartjs-2";
import spendData from "../../data/SpendRangeByVMRS.json"
// import classes from "./style.module.css";
import './styles.scss'


export default function DoughnutChart() {
  // Sample data for the three categories
  const doughnutData = {
    labels: spendData.labels,
    datasets: [
      {
        label: "Count",
        data: spendData.values, // Replace with your actual values
        backgroundColor: [
          "#38c474",
          "#141c50",
          "#9fa8da",
        ],
        borderColor: "transparent",
        borderWidth: 0,
        // borderRadius: 30,
        hoverOffset: 0,
      }
    ]
  };

  return (
    // <div className="doughnutChartContainer">
      <div className="doughnutChartMain">
        <Doughnut
          data={doughnutData}
          options={{
            cutout: '75%',
            plugins: {
              legend: {
                position: 'right',
                labels: {
                  padding: 20,
                  usePointStyle: true,
                  pointStyle: 'circle',
                }
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return `${context.label}: ${context.raw}`;
                  }
                }
              }
            },
            maintainAspectRatio: false,
          }}
        />
      </div>
    // </div>
  );
}
