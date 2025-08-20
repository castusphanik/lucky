import React from "react";
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Line } from "react-chartjs-2";

import classes from "./style.module.css";
import totalMaintenanceNRepairCost from "../../data/TotalMaintenanceAndRepairCost.json";
// import { callback } from "chart.js/helpers";

interface MaintenanceData {
  month: string;
  cost: number;
}

export default function Linechart() {
  return (
    <div className={classes.totalMaintenanceNRepairCostContainer}>
      <div className={classes.totalMaintenanceNRepairCost}>
      <Line
        data={{
          // x-axis months
          labels: totalMaintenanceNRepairCost.map((data: MaintenanceData) => data.month),
          // array od datasets objects, add another object if you want anithe line on the chart
          datasets: [
            {
              label: "Count",
              data: totalMaintenanceNRepairCost.map((data: MaintenanceData) => data.cost),
              backgroundColor: "rgba(139, 92, 246, 0.3)",
              borderColor: "#8B5CF6",
              borderWidth: 3,
              fill: true,
              tension: 0.4,

              pointRadius: 0, //Size of dots
              // STYLING FOR THE DOTS ON THE LINE
              //   pointBackgroundColor: "#8B5CF6", // Purple fill color for dots
              //   pointBorderColor: "#8B5CF6", // Purple border color for dots
              //   pointBorderWidth: 2, // Thickness of dot borders
              //   pointRadius: 4, // Size of dots (4 pixels radius)
              //   pointHoverRadius: 6, // Size of dots when you hover over them
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            //Legend configuration  --> the colored box that explains what each line means
            legend: {
              display: false, // Hide legend since we only have one line and the title explains it
            },
          },
          scales: {
            y: {
              min: 1000,
              max: 6000,
              grid: {
                display: false, // Removes horizontal grid lines
              },
              ticks: {
                stepSize: 1000,
                callback: function(value : string | number) {
                    if(typeof value === "string") {
                        value = parseFloat(value)
                    }
                    return `$${value / 1000}k`;
                }
                // callback: function (value: number ) {
                //   return `$${value / 1000}k`;
                // },
              },
            },

            x: {
              grid: {
                display: false, // Removes horizontal grid lines
              },
            },
          },
          interaction: {
            intersect: false, // Show tooltip even when not directly over a point
            mode: "index", // Show data for all datasets at the same x-position when hovering
          },
        }}
      />
    </div>
    </div>
  );
}
