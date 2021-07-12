import jwt from "jsonwebtoken";

export const Authenticate = (req) => {
  // This checks to see if there is an authorization field within the incoming request
  const authHeader = req.headers.authorization;
  let isAuth = false;

  // if there is no token
  if (!authHeader) {
    return {
      isAuth,
    };
  }

  // format of request sent will be Bearer tokenvalue
  // this splits it into two values bearer and the token
  const token = authHeader.split(" ")[1];

  // if the token is null or an empty string
  if (!token || token === "") {
    return {
      isAuth,
    };
  }
  // console.log(token);

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.SECRET);
    if (!decodedToken) {
      return {
        isAuth,
      };
    }
  } catch (e) {
    return {
      isAuth,
    };
  }

  // shows the user is an authenticated user
  // pulls data off the token
  const { id, userName } = decodedToken;
  isAuth = true;

  console.log(isAuth, userName, id);

  return {
    isAuth,
    id,
    userName,
  };
};
