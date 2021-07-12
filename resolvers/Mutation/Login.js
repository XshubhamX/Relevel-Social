import User from "../../model/User.js";
import jwt from "jsonwebtoken";

export const Login = async (parent, args, context) => {
  try {
    const existingUser = await User.findOne({ email: args.email });
    if (!existingUser) {
      throw new Error("User doesNot exist");
    }
    const match = await bcrypt.compare(args.password, existingUser.password);
    if (!match) {
      throw new Error("Incorrect password");
    }
    const token = jwt.sign(
      { id: existingUser._id, userName: existingUser.userName },
      process.env.SECRET
    );

    const returnData = {
      user: existingUser,
      token,
      expirationTime: 1,
    };
    return returnData;
  } catch (e) {
    throw new Error(e);
  }
};
