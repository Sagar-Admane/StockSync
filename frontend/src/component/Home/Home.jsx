import React, { useContext, useState } from "react";
import style from "./home.module.scss";
import Auth from "../GoogleAuth/GoogleAuth.jsx";
import Login from "../Login/Login";
import Signup from "../Signup/Signup";
import logo from "../../assets/logo.svg"
import footer from "../../assets/Footer.png"
import {motion} from "framer-motion"
import context from "../../context/context.js";

function Home() {
    const {login} = useContext(context);

  return (
    
    <div className={style.container}>

<motion.div
      initial={{ opacity: 0, y: 50 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -50 }} 
      transition={{ duration: 1, ease: "easeOut" }} 
    >

      <div className={style.container1}>
        <div className={style.header}>
          <img src={logo} alt="" />
          <p>Real Time Stock Market Review</p>
        </div>


        <div className={style.login}>
          <div className={style.left}>
            <Auth />
          </div>
          <div className={style.right}>{login ? <Login /> : <Signup />}</div>
        </div>

        <div className={style.footer}>
          <img src={footer} alt="" srcset="" />
        </div>
      </div>

    </motion.div>

    </div>
  );
}

export default Home;
