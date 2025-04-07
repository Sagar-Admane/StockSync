import React, { useContext } from 'react';
import style from "./chart2.module.scss";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import context from '../../context/context';

function Chart2({ symbol }) {
  
  
  const {forPredict, setForPredit} = useContext(context);
  
  const formattedData = forPredict?.map((value, index) => ({
    price: value,
    name: `Point ${index + 1}`, 
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
