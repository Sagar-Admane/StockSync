import React from 'react';
import style from "./chart2.module.scss";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

function Chart2({ price }) {
  // Transform array of numbers into array of objects for Recharts
  const formattedData = price.map((value, index) => ({
    price: value,
    name: `Point ${index + 1}`, // Optional: you can replace this with timestamps or labels
  }));

  return (
    <div className={style.container}>
      <div className={style.chart}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formattedData}>
            <XAxis dataKey="name" />
            <YAxis domain={["auto", "auto"]} />
            <Tooltip />
            <Line
              type="monotoneX"
              dataKey="price"
              stroke="green"
              strokeWidth={2}
              dot={{ r: 4 }}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Chart2;
