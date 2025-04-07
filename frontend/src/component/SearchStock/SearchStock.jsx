import React, { useContext, useEffect, useState } from "react";
import style from "./searchstock.module.scss";
import Left from "../Left/Left";
import HeaderTop from "../Header/Header";
import context from "../../context/context";
import green from "../../assets/green2.jpg";
import red from "../../assets/red.jpg";
import GridLoader from "react-spinners/GridLoader"
import { useNavigate } from "react-router-dom";

function SearchStock() {
  const { resSearch, clickedStock, setClickedStock, loading} = useContext(context);
  const [stockData, setStockData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (resSearch?.length) {
      setStockData(resSearch);
    }
  }, [resSearch]);

  function handleClickStock(stock){
    console.log(stock);
    setClickedStock([stock]);
    navigate("/singlestock")
  }

  console.log(clickedStock);

  return ( 
    <div className={style.container}>
      <div className={style.left}>
        <Left />
      </div>
      <div className={style.right}>
        <HeaderTop />
        <div className={style.content}>
          {loading ? <div className={style.loader} >
            <GridLoader color="#ffffff" />
          </div> : 
          <>
          <div className={style.heading}>
            <div><p>Symbol</p></div>
            <div><p>Name</p></div>
            <div><p>Price</p></div>
            <div><p>Market Open</p></div>
            <div><p>Market Close</p></div>
            <div><p>Graph</p></div>
          </div>
          {stockData.map((stock, index) => (
            <div onClick={() => handleClickStock(stock)}  className={style.list}>
              <div className={style.listName}>
                <div><p style={{fontWeight : "bold"}} >{stock.symbol}</p></div>
                <div><p style={{color: "rgba(255, 255, 255, 0.501)"}}>{stock.name}</p></div>
                <div><p style={stock.marketOpen < stock.marketClose ? {color : "red"} : {color : "green"}} >{stock.marketOpen > stock.marketClose ? "+ " : "- "}${stock.price}</p></div>
                <div><p>${stock.marketClose}</p></div>
                <div><p>${stock.marketOpen}</p></div>
                <div><img style={{height : "50px", width : "10rem"}} src={stock.marketOpen > stock.marketClose ? green : red} alt="Stock Status" /></div>
              </div>
            </div>
          ))}
          </>
        }
        </div>
      </div>
    </div>
  )
}

export default SearchStock;
