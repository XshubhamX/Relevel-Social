import User from "../../model/User.js";
import Otp from "../../model/Otp.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const Signup = async (parent, args, context) => {
  let newUser;

  try {
    let hashedPassword = await bcrypt.hash(args.userData.password, 12);
    newUser = await User.create({
      ...args.userData,
      password: hashedPassword,
    });
  } catch (e) {
    throw new Error(e);
  }
  const token = jwt.sign(
    { id: newUser._id, userName: newUser.userName },
    process.env.SECRET
  );

  const returnData = {
    user: newUser,
    token,
  };
  return returnData;
};
