import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { useState } from "react";
import "./styles.scss";
import CustomDropdown from "../Form/Dropdown";

const shipmentData = [
  { name: "Jan", Freight: 5, Standard: 0, Express: 0 },
  { name: "Feb", Freight: 10, Standard: 0, Express: 0 },
  { name: "Mar", Freight: 12, Standard: 6, Express: 0 },
  { name: "Apr", Freight: 10, Standard: 10, Express: 20 },
  { name: "May", Freight: 10, Standard: 15, Express: 20 },
  { name: "Jun", Freight: 18, Standard: 10, Express: 0 },
  { name: "Jul", Freight: 12, Standard: 5, Express: 0 },
  { name: "Aug", Freight: 13, Standard: 0, Express: 0 },
  { name: "Sep", Freight: 8, Standard: 0, Express: 0 },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "#fff",
        padding: "8px 12px",
        borderRadius: "6px",
        boxShadow: "0px 0px 6px rgba(0,0,0,0.1)",
        fontSize: "13px",
      }}>
        {payload.map((entry: any, index: number) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              marginBottom: index !== payload.length - 1 ? "6px" : "0",
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                backgroundColor: entry.color,
                borderRadius: "50%",
              }}
            />
            <span style={{ color: "#333", fontWeight: 500 }}>{entry.name}</span>
            <span style={{ color: entry.color, marginLeft: "auto" }}>
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return null;
};



const ShipmentOverview = () => {
  const [filter, setFilter] = useState("All");
  const ticks = [0, 10, 20, 30, 40, 50, 60];

  const getBarRadius = (entry, key) => {
  if (entry[key] === 0) return [0, 0, 0, 0];

  const { Freight, Standard, Express } = entry;

  if (key === "Express" && Express > 0) return [5, 5, 0, 0];
  if (key === "Standard" && Standard > 0 && Express === 0) return [5, 5, 0, 0];
  if (key === "Freight" && Standard === 0 && Express === 0) return [5, 5, 0, 0];

  return [0, 0, 0, 0];
};


  return (
    <div className="shipment-card">
      <div className="shipment-header">
        <h3>Monthly Shipment Overview</h3>
        <CustomDropdown
          placeholder="Shipment Type"
          className="shipment-select"
          options={["option 1", "option 2", "option 3"]}
        />
      </div>

      <div className="shipment-chart">
        <ResponsiveContainer width="100%" height={300}>
         <BarChart data={shipmentData} barCategoryGap={10}>
  <defs>
    <pattern id="diagonal-stripes" patternUnits="userSpaceOnUse" width="4" height="6" patternTransform="rotate(45)">
      <line x1="0" y="0" x2="0" y2="6" stroke="#C3D2E3" strokeWidth="2" />
    </pattern>
  </defs>

  <CartesianGrid stroke="var(--color-border)" vertical={false} />
  <XAxis dataKey="name" tickLine={false} stroke="var(--color-border" />
  <YAxis tickLine={false} axisLine={false} ticks={ticks} />
  <Tooltip  content={<CustomTooltip />} />

 <Bar
  dataKey="Freight"
  stackId="a"
  fill="url(#diagonal-stripes)"
  activeBar={{ fillOpacity: 1, stroke: "none" }}
  radius={(entry) => getBarRadius(entry.payload, "Freight")}
/>
<Bar
  dataKey="Standard"
  stackId="a"
   fill="#0D1A50"
  radius={(entry) => getBarRadius(entry.payload, "Standard")}
/>
<Bar
  dataKey="Express"
  stackId="a"
   fill="#3477F4"
  radius={(entry) => getBarRadius(entry.payload, "Express")}
/>

</BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ShipmentOverview;
