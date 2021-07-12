import User from "../model/User.js";
import { authCheck } from "../helper_functions/checkAuth.js";

const Query = {
  users: async (parent, args, ctx, info) => {
    authCheck(ctx); //checking auth
    let allUsers;
    try {
      allUsers = await User.find();
      if (allUsers.length === 0) {
        throw new Error("No users");
      }
      return allUsers;
    } catch (e) {
      throw new Error(e);
    }
  },
  getFriends: async (parent, args, ctx, info) => {
    authCheck(ctx); //checking auth

    const user = await User.findById(ctx.id);

    let returnFriends = [];

    //searching the friends from the User model

    returnFriends = user.friends.map(async (x) => {
      const friend = await User.findById(x);
      return friend;
    });

    return returnFriends;
  },
};
export { Query as default };
