import express from "express";
import { middleWare } from "../middleware/authMiddleware.js";
import { addToList, deleteFromList, getList } from "../controller/wishList.js";

const router = express();

router.post("/add", middleWare, addToList);
router.delete("/delete/:symbol", middleWare, deleteFromList);
router.get("/",middleWare, getList);

export default router;