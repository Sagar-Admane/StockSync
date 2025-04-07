import React, { useEffect, useState } from "react";
import style from "./dashboard.module.scss";
import { useContext } from "react";
import context from "../../context/context";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/white.svg";
import { MdSpaceDashboard } from "react-icons/md";
import { AiOutlineStock } from "react-icons/ai";
import { MdContactSupport } from "react-icons/md";
import { HiOutlineLogout } from "react-icons/hi";
import { FaSearch } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import Stock from "../Sample Stock/Stock";
import Chart from "../Chart/Chart";
import Wishliststack from "../WishlistStack/Wishliststack";
import Left from "../Left/Left";
import HeaderTop from "../Header/Header";

function Dashboard() {
  const { userInfo, setUserInfo } = useContext(context);
  const navigate = useNavigate();

  useEffect(() => {
    const storedData = localStorage.getItem("userInfo");

    if (!storedData) {
      navigate("/");
    } else {
      try {
        const parsedData = JSON.parse(storedData);
        setUserInfo(parsedData);
      } catch (error) {
        console.error("Error parsing userInfo from localStorage", error);
        navigate("/");
      }
    }
  }, []);

  return (
    <div className={style.container}>
      <div className={style.left}>
        <Left />
      </div>

      <div className={style.right}>
        <HeaderTop />
        <div className={style.content}>
          <p>Stocks</p>
          <div className={style.stock}>
            <Stock />
          </div>
          <div className={style.info}>
            <Chart symbol={"AAPL"} />
            <Wishliststack />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
