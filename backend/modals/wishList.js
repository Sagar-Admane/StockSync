import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  stocks: [{ type: String }] 
});

const wishList = mongoose.model("Wishlist", wishlistSchema);

export default wishList;