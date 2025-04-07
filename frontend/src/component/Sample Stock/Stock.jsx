import React, { useEffect, useState } from 'react'
import axios from "axios"
import style from "./stock.module.scss"
import green from "../../assets/green2.jpg"
import red from "../../assets/red.jpg"

function Stock() {

  const symbols = ["AAPL", "SOL", "AMZN", "MSFT"];
  const [stockData, setStockData] = useState([]);
  const [stockLogo, setStockLogo] = useState([]);

  async function getData(symbol){
    const data = JSON.parse(localStorage.getItem("userInfo"));
    try {
      const result = await axios.post("http://localhost:5001/stock",{
        symbol,
      }, {
        headers : {
          Authorization : `Bearer ${data.token}`
        }
      })
      console.log(result.data);
      return result.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async function getLogo(symbol){
    const apiKey = "cvknuppr01qtnb8tre60cvknuppr01qtnb8tre6g";
    const url = `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${apiKey}`;
    try {
      const response = await axios.get(url);
      return response.data.logo
    } catch (error) {
      console.log("error fetching logo : ", error);
      return null;
    }
  }

  useEffect(()=>{
    async function fetchData(){
    const data1 = await Promise.all(symbols.map((s) => getData(s))); 
    setStockData(data1.filter((item) => item!==null));
    const data2 = await Promise.all(symbols.map((s) => getLogo(s)));
    setStockLogo(data2.filter((item) => item!==null));
  }
  fetchData();
  }, [])

  return (
    <div className={style.container} >
      {stockData.map((stock, index) => (
        <div key={index}>
          <div>
          {stockLogo[index] && <img src={stockLogo[index]} alt="Stock Logo" width="50" />}
          <img src={stock.open < stock.price ? green : red} style={{height : "50px", width : "150px"}} />
          </div>
          <p className={style.para} >{stock.name}</p>
          <p className={style.para} >Price: <span style={{color : stock.open > stock.price ? "red" : "green"}} >{stock.open > stock.price ? "-" : "+"}${stock.price}</span></p>
        </div>
      ))}
    </div>
  )
}

export default Stock