import React, { useContext, useEffect, useState } from "react";
import style from "./singlestockinfo.module.scss";
import Left from "../Left/Left";
import HeaderTop from "../Header/Header";
import context from "../../context/context";
import { CiSquarePlus } from "react-icons/ci";
import { FaCheck } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Chart from "../Chart/Chart";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import socket from "../../Socket/socket";
import Chart2 from "../Chart2/Chart2";
import HashLoader from "react-spinners/HashLoader";

function SingleStockInfo() {
  const { clickedStock, setClickedStock, forPredict, setForPredit } =
    useContext(context);
  const [wishlistClicked, setWishListClicked] = useState(false);
  const [liveStock, setLiveStock] = useState(clickedStock[0]);
  const [predictedPrice, setPredictedPrice] = useState();
  const [newArr, setNewArr] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (forPredict && forPredict.length > 0) {
      setNewArr(forPredict);
    }
  }, [forPredict]);

  console.log("This is after anhything : ", newArr);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    socket.emit("subscribeStock", clickedStock[0].symbol);
    socket.on("stockUpdate", (data) => {
      console.log("Real Time Stock Update : ", data);
      setClickedStock((prev) => ({
        ...prev,
        price: data.price,
        high: data.high,
        low: data.low,
        marketOpen: data.open,
        marketClose: data.close,
        time: data.time,
      }));
    });
    return () => {
      socket.off("stockUpdate");
    };
  }, [clickedStock]);

  async function handlePredict(symbol) {
    try {
      setLoading(true);
      const response = await axios.post(
        `http://localhost:8000/predict`,
        {
          symbol: symbol,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setLoading(false);
      console.log("Predicted Price : ", response.data.predicted_price);
      setPredictedPrice(response.data.predicted_price);
      setForPredit((prev) => [...prev, response.data.predicted_price]);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleButton() {
    setWishListClicked(true);
    try {
      const data = await axios.post(
        "http://localhost:5001/wishlist/add",
        {
          symbol: clickedStock[0].symbol,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      if (data) {
        console.log(data);
        console.log(data.status);
        if (data.status === 200) {
          toast.success("Stock added to wishlist");
        }
      }
    } catch (error) {
      console.log("Error is : ", error);
      if (error.status === 400) {
        toast.error("Stock is already present in wishlist");
      }
    }
  }

  useEffect(() => {
    if (predictedPrice !== undefined) {
      setNewArr((prev) => [...prev, predictedPrice]);
    }
  }, [predictedPrice]);

  return (
    <div className={style.container}>
      <ToastContainer />
      <div className={style.left}>
        <Left />
      </div>
      <div className={style.right}>
        <HeaderTop />
        <div className={style.content}>
          <div className={style.name}>
            <div className={style.symbol}>
              <p>
                {clickedStock[0].name} ({clickedStock[0].symbol})
              </p>
              {clickedStock[0].marketOpen > clickedStock[0].marketClose ? (
                <p style={{ fontSize: "18px", color: "green" }}>
                  + ${clickedStock[0].price}
                </p>
              ) : (
                <p style={{ fontSize: "18px", color: "red" }}>
                  - ${clickedStock[0].price}
                </p>
              )}
              <p></p>
            </div>
            <div className={style.button}>
              <button onClick={handleButton}>
                <AnimatePresence mode="wait">
                  {wishlistClicked ? (
                    <div>
                      <motion.div
                        key="check"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                      >
                        <FaCheck size={20} />
                      </motion.div>
                      <p>Added to wishlist</p>
                    </div>
                  ) : (
                    <div>
                      <motion.div
                        key="plus"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                      >
                        <CiSquarePlus size={26} />
                      </motion.div>
                      <p>Add to wishlist</p>
                    </div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
          <div className={style.info}>
            <div className={style.mopen}>
              <p className={style.infoHead}>Market Open : </p>
              <p>$ {clickedStock[0].marketOpen}</p>
            </div>
            <div className={style.mclose}>
              <p className={style.infoHead}>Market Close : </p>
              <p>$ {clickedStock[0].marketClose}</p>
            </div>
            <div className={style.price}>
              <p className={style.infoHead}>Market Price : </p>
              <p>$ {clickedStock[0].price}</p>
            </div>
            <div className={style.exchng}>
              <p className={style.infoHead}>Market Exchange : </p>
              <p>{clickedStock[0].exchange}</p>
            </div>
          </div>
          <div className={style.chart}>
            <h2>Chart</h2>
            <div>
              <Chart symbol={clickedStock[0].symbol} />
            </div>
          </div>
          <div className={style.container3}>
            <p className={style.dis}>
              Disclaimer : These are not 100% accurate. Consider it as second
              option
            </p>
            {console.log("Stock array for prediction is : ", forPredict)}
            <button
              className={style.btn}
              onClick={() => handlePredict(clickedStock[0].symbol)}
            >
              Predict Stock
            </button>
            <p>The predicted price is : {predictedPrice}</p>
            {console.log(newArr)}
            {loading ? (
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <HashLoader color="#ffffff" />
              </div>
            ) : (
              forPredict && <Chart2 symbol={clickedStock[0].symbol} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleStockInfo;
