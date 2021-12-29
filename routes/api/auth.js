// import express from "express";
import Router from "express-promise-router";
import jwt from "jsonwebtoken";
import config from "config";
import User from "../../models/User.js";
import Admin from "../../models/Admin.js";
import auth from "../../middleware/auth.js";
import adminAuth from "../../middleware/adminAuth.js";
import { check, validationResult } from "express-validator";
import bcrypt from "bcrypt";

// const router = express.Router();
const router = Router();
const adminKey = config.get("adminKey");

// Authenticate a token to get user
// @api/auth
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    user && res.json(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

// Authenticate Admin Token
// @api/auth/admin/adminKey
router.get(`/admin/${adminKey}`, adminAuth, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("-password");
    admin && res.json(admin);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

//route  @api/auth
//desc   Validate User or Login user
//access Public
router.post(
  "/",
  check("email").isEmail().withMessage("Please provid a valid email"),
  check("password")
    .isLength({ min: 5 })
    .withMessage("Please enter a valid passowrd of 5 character")
    .matches(/\d/)
    .withMessage("Password must contain a number"),
  async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    let { email, password } = req.body;
    try {
      // try to find a user
      let user = await User.findOne({ email });
      if (!user) return res.status(400).json({ errors: [{ msg: "User does not exist" }] });

      let isMatch = bcrypt.compareSync(password, user.password);
      !isMatch && res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });

      const payload = {
        user: {
          id: user.id,
        },
      };
      const secretKey = config.get("jwtSecrectKey");
      jwt.sign(payload, secretKey, { expiresIn: 3600 * 10 }, (err, token) => {
        if (err) throw err;
        return res.json({ token });
      });
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//route  @ api/auth/admin/adminKey
//desc   Validate Admin
//access Public
router.post(
  `/admin/${adminKey}`,
  check("email").isEmail().withMessage("Please provid a valid email"),
  check("password")
    .isLength({ min: 5 })
    .withMessage("Please enter a valid passowrd of 5 character")
    .matches(/\d/)
    .withMessage("Password must contain a number"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    // !errors.isEmpty() && res.status(400).json({ errors: errors.array() });
    const { email, password } = req.body;
    try {
      const admin = await Admin.findOne({ email });
      if (!admin) return res.status(400).json({ errors: [{ msg: "No Admin" }] });

      const isMatch = bcrypt.compareSync(password, admin.password);
      !isMatch && res.status(400).json({ errors: [{ msg: "Do Not Try To Hack" }] });

      const payload = {
        admin: {
          id: admin.id,
        },
      };
      const secretKey = config.get("jwtSecrectKey");
      jwt.sign(payload, secretKey, { expiresIn: 3600 * 10 }, (err, token) => {
        if (err) throw err;
        return res.json({ token });
      });
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  }
);

export default router;
