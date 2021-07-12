import User from "../../model/User.js";
import Otp from "../../model/Otp.js";
import bcrypt from "bcryptjs";
import { sendConfirmationEmail } from "../../helper_functions/SendMail.js";

export const SendOtp = async (parent, args, context) => {
  const email = args.data.email.toLowerCase();
  //   let existingUser;

  //   try {
  //     existingUser = await User.findOne({ email: args.data.email });
  //   } catch (e) {
  //     throw new Error(e);
  //   }

  //   if (existingUser) {
  //     throw new Error("Username or email already in use");
  //   }

  const otp = await sendConfirmationEmail(email);

  const otp_already_sent_previously = await Otp.findOne({ email });

  if (otp_already_sent_previously) {
    if (args.data.password) {
      try {
        otp_already_sent_previously.password = await bcrypt.hash(
          args.data.password,
          12
        );
      } catch (e) {
        throw new Error();
      }
    }

    try {
      otp_already_sent_previously.text = otp;
    } catch (e) {
      throw new Error(e);
    }
    await otp_already_sent_previously.save();

    return { databaseId: otp_already_sent_previously._id };
  }

  let hashedPassword;

  try {
    hashedPassword = await bcrypt.hash(args.data.password, 12);
  } catch (e) {
    throw new Error();
  }

  let otp_object;

  try {
    otp_object = new Otp({
      text: otp,
      email: args.data.email,
      password: hashedPassword,
    });
  } catch (e) {
    throw new Error(e);
  }

  await otp_object.save();

  return { databaseId: otp_object._id };
};
