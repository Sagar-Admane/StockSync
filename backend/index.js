import express from "express"
import env from "dotenv";
import userRoute from "./route/userRoute.js";
import stockRouter from "./route/stockRoute.js";
import dataRoute from "./route/dataRoute.js";
import wishlistRouter from "./route/wishlistRoute.js";
import authRoute from "./route/authRoute.js"
import db from "./config/db.js"
import yahooFinance from "yahoo-finance2";
import {Server} from "socket.io";
import cors from "cors";


const app = express();
env.config();
db();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT;

app.get("/", (req, res)=>{
    res.send("API is running");
})

app.use("/user", userRoute);
app.use("/auth", authRoute);
app.use("/stock", stockRouter);
app.use("/wishlist", wishlistRouter);
app.use("/data", dataRoute);



async function fetchData(symbol){
    try {
        const result = await yahooFinance.quote(symbol);

        return{
            symbol: result.symbol,
            name: result.shortName,
            price: result.regularMarketPrice,
            high: result.regularMarketDayHigh,
            low: result.regularMarketDayLow,
            open: result.regularMarketOpen,
            close: result.regularMarketPreviousClose,
            time: new Date().toLocaleTimeString(),
        }

       

    } catch (error) {
        console.log("error fetching the data : ", error);
        return null;
    }
}

const server = app.listen(PORT, ()=>{
    console.log("Server started");
})

const io = new Server(server, {
    cors : {
        origin : "*",
        methods : ["GET", "POST"],
    }
})

io.on("connection", (socket) => {
    console.log("New client connected");

    let activeInterval = null;

    socket.on("subscribeStock", async (symbol) => {
        console.log(`Subscribed to: ${symbol}`);
        if (activeInterval) clearInterval(activeInterval);

        activeInterval = setInterval(async () => {
            const stockInfo = await fetchData(symbol);
            if (stockInfo) {
                socket.emit("stockUpdate", stockInfo);
            }
        }, 30000);
    });

    socket.on("disconnect", () => {
        if (activeInterval) clearInterval(activeInterval);
        console.log("Client disconnected");
    });
});
