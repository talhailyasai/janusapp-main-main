import jwt from "jsonwebtoken";
import User from "../models/User.js";

const sendTokenError = async (token, res) => {
  let decodedUser = jwt.decode(token, process.env.JWT_SECRET);
  console.log("decodedUser?.id", decodedUser?.id);
  await User.findByIdAndUpdate(
    decodedUser?.id,
    { isLogin: false },
    {
      new: true,
    }
  );
  res.status(401).json({ message: "Invalid authorization header" });
};

export const checkToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];
  // console.log('token',token)
  if (!authHeader) return sendTokenError(token, res);

  if (!token || !authHeader?.startsWith("Bearer"))
    return sendTokenError(token, res);

  if (process.env.ENVIRONMENT === "Production") {
    try {
      jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      console.log(error);
      return sendTokenError(token, res);
    }
  }
  let decodedUser = jwt.decode(token, process.env.JWT_SECRET);

  let foundUser = await User.findById(decodedUser?.id);
  if (!foundUser) return res.status(401).json({ message: "No User Found!" });
  // Check if user is logged in
  if (!foundUser.isLogin) {
    return sendTokenError(token, res);
  }
  // Check if token matches the one stored in database
  if (foundUser.token !== token) {
    return sendTokenError(token, res);
  }

  req.user = foundUser;
  return next();
};
