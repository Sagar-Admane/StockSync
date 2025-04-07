import express from "express";
import yahooFinance from "yahoo-finance2";
import env from "dotenv"
import cors from "cors"
import { Server } from "socket.io";

const app = express();
env.config();

const PORT = process.env.PORT;

const server = app.listen(PORT, ()=>{
    console.log("App started ..... ");
})

yahooFinance.suppressNotices(["yahooSurvey"]);

const io = new Server(server, {
    cors : {
        origin : "*",
        methods : ["GET", "POST"],
    }
})

const STOCK_SYMBOL = "IBM";

async function fetchStockData(){
    try {
        const result = await yahooFinance.quote(STOCK_SYMBOL);
        return{
            symbol : result.symbol,
            price : result.regularMarketPrice,
            time : new Date().toLocaleTimeString(),
        };
    } catch (error) {
        console.log("Error in fetching the stock data : ");
        console.log(error);
    }
}

io.on("connection", (socket)=>{
    console.log("New client connected");

    const interval = setInterval(async ()=>{
        const stockInfo = await fetchStockData();
        if(stockInfo){
            socket.emit("stockUpdate", stockInfo);
            console.log(stockInfo);
        }
    }, 30000);

    socket.on("disconnect", () => {
        clearInterval(interval);
        console.log("Client disconneted");
    })
})

async function getStockList(){
    try {
        const result = await yahooFinance.search("NASDAQ");
        console.log(result);
    } catch (error) {
        console.log(error);
    }
}

getStockList();