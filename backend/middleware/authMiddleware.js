import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import env from "dotenv";
import User from "../modals/userModal.js";

env.config();

async function middleWareFunction(req, res, next){
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try {
            token = req.headers.authorization.split(" ")[1];
            const decode = jwt.verify(token, process.env.SECRET);
            req.user = await User.findById(decode.id).select("-password");
            next();
        } catch (error) {
            res.status(401);
            throw new Error("Authorization failed");
        }
    }
    if(!token){
        res.status(401);
        throw new Error("No token found");
    }
}

const middleWare = asyncHandler(middleWareFunction);

export {middleWare};