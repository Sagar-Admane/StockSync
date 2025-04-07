import expressAsyncHandler from "express-async-handler";
import yahooFinance from "yahoo-finance2";

async function getDataFunctin(req, res){
    try {
        const symbol = req.params.symbol;
        
        const result = await yahooFinance.chart(symbol, {
            period1: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split("T")[0],
            period2 : new Date().toISOString().split("T")[0],
            interval : '1d',
        })
        console.log("30days result is : ", result); 
        res.json(result);
    } catch (error) {
        console.log("Error fetching the historical data: ", error);
        res.status(500).json({message : error.message});
    }
}

const getData = expressAsyncHandler(getDataFunctin);

export {getData};