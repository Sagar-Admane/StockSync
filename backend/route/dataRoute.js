import express from "express"
import { getData } from "../controller/data.js";

const router = express.Router();

router.get("/history/:symbol", getData);

export default router;