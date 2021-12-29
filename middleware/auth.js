import jwt from "jsonwebtoken";
import config from "config";

// validate user credentials as a middleware

export default (req, res, next) => {
  // checking the token
  const token = req.header("x-auth-token");
  !token && res.status(401).json({ msg: "no token, authorization denied" });
  // verify the token
  try {
    //   verifying the token
    const decoded = jwt.verify(token, config.get("jwtSecrectKey"));
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid token, authorization denied" });
  }
};
