import User from "../model/User.js";

const Query = {
  users: async (parent, args, ctx, info) => {
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
};

export { Query as default };
