import express from "express";
import yahooFinance from "yahoo-finance2";
import asyncHandler from "express-async-handler";
import expressAsyncHandler from "express-async-handler";

async function getAllStockFunction(req, res) {
    // try {
    //     const {query} = req.query;
    //     if(!query){
    //         return res.status(404).json({error : "Stock query is required"});
    //     }
    //     const result = await yahooFinance.search(query);
    //     const stocks = result.quotes.map((stock) => ({
    //         symbol : stock.symbol,
    //         name : stock.shortname || stock.longname,
    //         exchane : stock.exchange,
    //         type : stock.quoteType
    //     }));
    //     res.json(stocks);
    // } catch (error) {
    //     console.log("Error in searching for stocks : ", error);
    //     res.status(500).json({error : "Failed to fetch stock data"});
    // }

    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ error: "Stock query is required" });
        }

        const result = await yahooFinance.search(query);
        
        if (!result.quotes || result.quotes.length === 0) {
            return res.status(404).json({ error: "No stocks found" });
        }

        const stockData = await Promise.all(
            result.quotes.map(async (stock) => {
                try {
                    if (!stock.symbol) {
                        console.warn(`Skipping stock with missing symbol:`, stock);
                        return null;
                    }

                    const quote = await yahooFinance.quote(stock.symbol).catch(err => {
                        console.error(`Error fetching quote for ${stock.symbol}:`, err);
                        return null;
                    });

                    if (!quote) return null; 
                    console.log(quote);
                    return {
                        symbol: stock.symbol,
                        name: stock.shortname || stock.longname || "N/A",
                        score: stock.score || 0,
                        price: quote.regularMarketPrice ?? "N/A",
                        currency: quote.currency ?? "N/A",
                        marketOpen: quote.regularMarketOpen ?? "N/A",
                        marketClose: quote.regularMarketPreviousClose ?? "N/A",
                        exchange : quote.exchange ?? "N/A", 
                    };
                } catch (err) {
                    console.error(`Error processing stock ${stock.symbol}:`, err);
                    return null;
                }
            })
        );

        const filteredStockData = stockData.filter(stock => stock !== null);
        res.json(filteredStockData);
    } catch (error) {
        console.error("Error in searching for stocks:", error);
        res.status(500).json({ error: "Failed to fetch stock data" });
    }

}

const getAllStock = asyncHandler(getAllStockFunction);

async function getInfoFunction(req, res) {
    const { symbol } = req.body;
    try {
        const result = await yahooFinance.quote(symbol);
        console.log(result);

        res.json({
            symbol: result.symbol,
            name: result.shortName,
            price: result.regularMarketPrice,
            high: result.regularMarketDayHigh,
            low: result.regularMarketDayLow,
            open: result.regularMarketOpen,
            close: result.regularMarketPreviousClose,
            time: new Date().toLocaleTimeString(),
        })



    } catch (error) {
        console.log("error fetching the data : ", error);
        return null;
    }
}

const getInfo = expressAsyncHandler(getInfoFunction);

export { getAllStock, getInfo };