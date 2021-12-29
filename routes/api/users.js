// import express from "express";
import Router from "express-promise-router";
import { check, validationResult } from "express-validator";
import User from "../../models/User.js";
import config from "config";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import auth from "../../middleware/auth.js";

// const router = express.Router();
const router = Router();

//@route POST api/users
//desc   Register a user
//access Public
router.post(
  "/",
  check("name").not().isEmpty().withMessage("Please enter a valid username"),
  check("email").isEmail().withMessage("Please enter a valid email address"),
  check("password")
    .isLength({ min: 5 })
    .withMessage("Please enter a valid passowrd of 5 character")
    .matches(/\d/)
    .withMessage("Password must contain a number"),
  async (req, res) => {
    const errors = validationResult(req);
    !errors.isEmpty() && res.status(400).json({ errors: errors.array() });
    const { name, email, password } = req.body;

    try {
      // checking existing user
      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ errors: [{ msg: "User already existed, try another email." }] });

      //   create a new user
      user = new User({ name, email, password });

      //   encrypt password
      const salt = bcrypt.genSaltSync(10);
      user.password = bcrypt.hashSync(password, salt);

      // save to DB
      await user.save();

      //   Creating Token
      const payload = {
        user: {
          id: user.id,
        },
      };
      const secretKey = config.get("jwtSecrectKey");
      jwt.sign(payload, secretKey, { expiresIn: 3600 * 10 }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (err) {
      console.log(err.message);
      res.status(500).json("Server Error");
    }
  }
);

//@route   PUT api/users/avatar
//desc   Update user avatar
//access private
// router.put("/avatar", check("avatar").not().isEmpty().withMessage("You need to provide a string for the avatar"), auth, async (req, res) => {
//   try {
//     const user = await User.findOne({ _id: req.user.id }).select("-password");
//     const { avatar } = req.body;
//     if (user) {
//       user.avatar = avatar;
//       await user.save();
//       return res.json(avatar);
//     }
//     res.json("User not found!");
//   } catch (err) {
//     console.log(err.message);
//     res.status(500).json("Server Error");
//   }
// });

export default router;
