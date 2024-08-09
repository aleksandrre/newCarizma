import jwt from "jsonwebtoken";

export function generateAccessToken(user) {
  const userproperties = {
    id: user._id,
    username: user.username,
    isAdmin: user.isAdmin,
  };
  return jwt.sign(userproperties, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "22760s",
  });
}

export function generateRefreshToken(user) {
  const userproperties = {
    id: user._id,
    username: user.username,
    isAdmin: user.isAdmin,
  };
  return jwt.sign(userproperties, process.env.REFRESH_TOKEN_SECRET);
}
