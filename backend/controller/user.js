import asyncHandler from "express-async-handler";
import User from "../modals/userModal.js";
import bcrypt from "bcryptjs"
import generateToken from "../config/generateToken.js";

async function signupFunction(req, res){
    const {name, email, password} = req.body;

    if(!name || !email || !password){
        res.status(404);
        throw new Error("Please provide all the information");
    }

    const userExist = await User.findOne({email});
    if(userExist){
        res.status(400);
        throw new Error("User already exist");
    }

    const user = await User.create({
        name,
        email,
        password
    });

    if(user){
        res.status(201).json({
            _id : user._id,
            name : user.name,
            password : user.password,
            token : generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error("Failed to create a new user");
    }

};

const signup = asyncHandler(signupFunction);

async function loginFunction(req, res){
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(user){
        const pass = user.password;
        if(await bcrypt.compare(password, pass)){
            res.json({
                _id : user._id,
                name : user.name,
                email : user.email,
                token : generateToken(user._id),
            })
        } else {
            res.status(401);
            throw new Error("Password is incorrect");
        }
    } else {
        res.status(404);
        throw new Error("User does not exist");
    }
}

const login = asyncHandler(loginFunction);

export {signup, login}