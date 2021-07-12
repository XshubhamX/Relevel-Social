import User from "../../model/User.js";
import { authCheck } from "../../helper_functions/checkAuth.js";

export const addFriend = async (parent, args, context) => {
  authCheck(context);

  //finding user and updating friends foreign field

  const legit_friend = await User.findById(args.user_id);
  if (!legit_friend) {
    return { success: false };
  }

  const user = await User.findByIdAndUpdate(context.id, {
    $push: {
      friends: legit_friend,
    },
  });

  return { success: true };
};
