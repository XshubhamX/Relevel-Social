import User from "../../model/User.js";
import Otp from "../../model/Otp.js";
import jwt from "jsonwebtoken";

const confirmOtp = async (databaseId, otp) => {
  let otp_object;

  try {
    otp_object = await Otp.findOne({ _id: databaseId });
  } catch (e) {
    throw new Error(e);
  }

  if (!otp_object) {
    throw new Error("Incorrect Otp");
  }

  if (otp_object.text !== otp) {
    throw new Error("Incorrect Otp");
  }
  return otp_object;
};

export const Signup = async (parent, args, context) => {
  let newUser;

  const otp_object = await confirmOtp(args.databaseId, args.otp);

  try {
    newUser = await User.create({
      ...args.userData,
      email: otp_object.email,
      password: otp_object.password,
    });
  } catch (e) {
    throw new Error(e);
  }
  const token = jwt.sign(
    { id: newUser._id, userName: newUser.userName },
    process.env.SECRET
  );

  try {
    await Otp.deleteOne({
      _id: otp_object.id,
    });
  } catch (e) {
    throw new Error(e);
  }

  const returnData = {
    user: newUser,
    token,
    expirationTime: 1,
  };
  return returnData;
};
