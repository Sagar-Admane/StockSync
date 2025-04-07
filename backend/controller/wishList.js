import asyncHandler from "express-async-handler";
import User from "../modals/userModal.js";

async function addToListFunction(req, res){
    try {
        const {symbol} = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);

        if(user.wishlist.includes(symbol)){
            return res.status(400).json({message : "Stock already in wishlist"});
        }

        user.wishlist.push(symbol);
        await user.save();

        res.json({message : "Stock added to wishlist", wishlist : user.wishlist});

    } catch (error) {
        console.log("Error adding to wishlist : ", error );
        res.status(500).json({error : error});
    }
}

const addToList = asyncHandler(addToListFunction);

async function deleteFromListFunction(req, res){
    try {
        const userId = req.user.id;
        const {symbol} = req.params;

        const user = await User.findById(userId);

        user.wishlist = user.wishlist.filter(stock => stock!==symbol);

        await user.save();

        res.json({message : "Symbol deleted from wishList", wishlist : user.wishlist});

    } catch (error) {
        console.log("Error removing from wishList: ", error);
        res.status(500).json({error : error});
    }
}

const deleteFromList = asyncHandler(deleteFromListFunction);

async function getListFunction(req, res){
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        res.json(user.wishlist);
    } catch (error) {
        console.log(error);
        res.status(500).json({error : error});
    }
}

const getList = asyncHandler(getListFunction);

export {addToList, deleteFromList, getList};