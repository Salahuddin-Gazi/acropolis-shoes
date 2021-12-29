import jwt from "jsonwebtoken";
import config from "config";

// validate admin credentials as a middleware

export default (req, res, next) => {
  // checking the token
  const token = req.header("x-admin-auth-token");
  !token && res.status(401).json({ msg: "no token, Admin Credential Fails" });
  // verify the token
  try {
    //   verifying the token
    const decoded = jwt.verify(token, config.get("jwtSecrectKey"));
    req.admin = decoded.admin;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid token, authorization denied" });
  }
};
