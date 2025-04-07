import jwt from "jsonwebtoken";
import env from "dotenv";

env.config();

function generateToken(id){
    return jwt.sign({id}, process.env.SECRET, {
        expiresIn : "30d",
    })
}

export default generateToken;