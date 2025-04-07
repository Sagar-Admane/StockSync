import React, { useEffect, useState, useRef, useContext } from "react";
import style from "./chart.module.scss";
import axios from "axios";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { io } from "socket.io-client";
import context from "../../context/context";

function Chart({ symbol }) {
  const [data, setData] = useState([]);
  const [imgSrc, setImgSrc] = useState("");
  const [data2, setData2] = useState({});
  const socketRef = useRef(null);
  const {forPredict, setForPredit} = useContext(context);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:5001");

      socketRef.current.on("connect", () => {
        console.log("Socket Connected:", socketRef.current.id);
      });
    }

    const socket = socketRef.current;

    if (!symbol) return;

    socket.emit("subscribeStock", symbol);

    const handleStockUpdate = (update) => {
      console.log("Real-time update:", update);

      const newPoint = {
        date: new Date().toLocaleTimeString(),
        price: update.price,
        color: update.price > update.open ? "green" : "red",
      };

      console.log("The data after establishing a stock is : ", newPoint);
      setData((prev) => [...prev.slice(-9), newPoint]);

      setData2((prev) => ({
        ...prev,
        price: update.price,
        open: update.open,
        close: update.close,
        high: update.high,
        low: update.low,
      }));
    };

    socket.on("stockUpdate", handleStockUpdate);

    return () => {
      socket.off("stockUpdate", handleStockUpdate);
    };
  }, [symbol]);

  async function getData(symbol) {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    try {
      const res = await axios.post(
        "http://localhost:5001/stock",
        { symbol },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setData2(res.data);
    } catch (err) {
      console.error("Error fetching stock details:", err);
    }
  }

  async function getLogo(symbol) {
    const apiKey = "cvknuppr01qtnb8tre60cvknuppr01qtnb8tre6g";
    try {
      const { data } = await axios.get(
        `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${apiKey}`
      );
      setImgSrc(data.logo);
    } catch (err) {
      console.error("Error fetching logo:", err);
    }
  }

  async function getInfo() {
    try {
      const { data } = await axios.get(
        `http://localhost:5001/data/history/${symbol}`
      );
      const formatted = data.quotes.map((c) => ({
        date: c.date.split("T")[0],
        price: c.close,
        color: c.close > c.open ? "green" : "red",
      }));
      setForPredit([]);
      setData(formatted);
      data.quotes.map((c) => {
        setForPredit(prev => [...prev, c.close]);
      })
    } catch (err) {
      console.error("Error fetching historical data:", err);
    }
  }

  useEffect(() => {
    if (symbol) {
      getInfo();
      getData(symbol);
      getLogo(symbol);
    }
  }, [symbol]);


  return (
    <div className={style.container}>
      <div className={style.img}>
        <img src={imgSrc} alt={symbol} height={70} width={70} />
        <div>
          <p style={{ fontSize: "18px" }}>Name: {data2.name}</p>
          <p style={{ fontSize: "18px" }}>
            Price:{" "}
            <span
              style={{
                color: data2.open > data2.price ? "red" : "green",
              }}
            >
              {data2.open > data2.price ? "-" : "+"}${data2.price}
            </span>
          </p>
        </div>
      </div>

      <div className={style.chart}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="date" />
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

export default Chart;
