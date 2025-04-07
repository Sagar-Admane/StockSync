import express from "express";
import { authJoin } from "../controller/auth.js";

const route = express.Router();

route.post("/", authJoin);

export default route;