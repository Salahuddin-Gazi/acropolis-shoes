// import express from "express";
import Router from "express-promise-router";
import { check, validationResult } from "express-validator";
import User from "../../models/User.js";
import Cart from "../../models/Cart.js";
import auth from "../../middleware/auth.js";
import adminAuth from "../../middleware/adminAuth.js";

// const router = express.Router();
const router = Router();

// @route POST api/cart
// @desc Create cart && update cart & save product into the cart // each user one cart
// @access Private
router.post("/", auth, [check("cartProduct").not().isEmpty().withMessage("No cartProduct")], async (req, res) => {
  // Checking with the required // checking errors
  const errors = validationResult(req);
  // Check if errors
  if (!errors.isEmpty()) {
    return res.status("400").json({ errors: errors.array() });
  }
  try {
    // Extracting cartProduct from body
    const { cartProduct } = req.body;

    // Checking the user exist or not
    let cart = await Cart.findOne({ "user.id": req.user.id });
    if (cart) {
      const prd_id = cartProduct.product;

      // checking the cartProduct exist or not
      const isExist = cart.products.filter((cart) => cart.product === prd_id)[0];
      if (isExist) {
        let index = cart.products.indexOf(isExist);

        // if exist then delete it to update later
        cart.products.splice(index, 1);
      }
      // Entering the product
      cart.products.unshift(cartProduct);
      await cart.save();
      return res.json(cart);
    }

    // for new profile, we create
    let cartFields = {
      user: {
        id: "",
        name: "",
      },
      products: [],
    };
    // Getting the user info
    const user = await User.findById(req.user.id).select("-password");
    cartFields.products.unshift(cartProduct);
    cartFields.user.id = req.user.id;
    cartFields.user.name = user.name;
    cart = new Cart(cartFields);
    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route DELETE api/cart
// @desc Delete a single product from user cart
// @access Private
router.delete("/:prd_id", auth, async (req, res) => {
  try {
    // Extracting product ID from body
    const prd_id = req.params.prd_id;

    // Checking the user exist or not
    let cart = await Cart.findOne({ "user.id": req.user.id });
    if (cart) {
      // checking the product exist or not
      const isExist = cart.products.filter((cart) => cart.product === prd_id)[0];
      if (isExist) {
        let index = cart.products.indexOf(isExist);
        // if exist then delete it
        cart.products.splice(index, 1);
        // saving after delete
        cart.products.length === 0
          ? (await Cart.deleteOne({ "user.id": req.user.id })) && res.json({ msg: "No Cart For This User" })
          : (await cart.save()) && res.json(cart);
      }
    }
    return res.json({ msg: "Product Not Found" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route GET api/cart
// @desc GET Whole Cart By User ID
// @access Private
router.get("/", auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ "user.id": req.user.id });
    if (!cart) {
      return res.status(401).json("No cart for this user");
    }
    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route DELETE api/cart
// @desc DELETE Whole Cart By ID
// @access Private
router.delete("/", auth, async (req, res) => {
  try {
    await Cart.findOneAndRemove({ "user.id": req.user.id });
    res.send("Your Cart Removed...");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route GET api/cart/all
// @desc GET All Users Cart
// @access Private
router.get("/all", adminAuth, async (req, res) => {
  try {
    const carts = await Cart.find();
    res.json(carts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

export default router;
