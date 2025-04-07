import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    googleId: { type: String },
    password: {
      type: String,
    },
    wishlist: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  console.log("Pre-save middleware triggered for:", this.email);
  console.log("Password before hashing:", this.password);
  if(!this.password){
    return next();
  }

  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

export default User;
