import express from "express"
import { middleWare } from "../middleware/authMiddleware.js";
import { getAllStock, getInfo } from "../controller/stock.js";

const router = express.Router();

router.get("/search", middleWare, getAllStock);
router.post("/", middleWare, getInfo);

export default router