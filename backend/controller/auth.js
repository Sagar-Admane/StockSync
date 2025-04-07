import expressAsyncHandler from "express-async-handler";
import User from "../modals/userModal.js";
import generateToken from "../config/generateToken.js";

async function authJoinFunction(req, res) {
  const { email, name, id } = req.body;

  console.log(id)
  console.log(name)
  console.log(email)

  try {
    const userExist = await User.findOne({ email });

    if (userExist) {
      console.log("User already exist");
      return res.status(200).json({
        _id: userExist._id,
        name: userExist.name,
        email: userExist.email,
        token: generateToken(userExist._id),
      });
    }

    const user = await User.create({
      name: name,
      email: email,
      googleId: id,
    });

    if (!user) {
      return res.status(400).json({ message: "Failed to create user" });
    }

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
}

const authJoin = expressAsyncHandler(authJoinFunction);
export { authJoin };
