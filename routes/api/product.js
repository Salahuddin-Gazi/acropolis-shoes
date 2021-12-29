// import express from "express";
import Router from "express-promise-router";
import User from "../../models/User.js";
import auth from "../../middleware/auth.js";
import Product from "../../models/Product.js";
import adminAuth from "../../middleware/adminAuth.js";
import { check, validationResult } from "express-validator";

// const router = express.Router();
const router = Router();

// @route GET api/product
// @desc Get all products
// @access Public
router.get("/", async (req, res) => {
  try {
    let products = await Product.find();
    res.json(products);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

// @route GET api/product/:product_id
// @desc Get product by ID
// @access Public
router.get("/:product_id", async (req, res) => {
  try {
    let product = await Product.findOne({ _id: req.params.product_id });
    res.json(product);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

// @route  POST api/product
// @desc   Create a product
// @access Private
router.post(
  "/",
  adminAuth,
  [
    check("status").not().isEmpty().withMessage("Please enter the status of the product"),
    check("itemName").not().isEmpty().withMessage("Please enter the name of the product"),
    check("itemDescription").not().isEmpty().withMessage("Please enter the description of the product"),
    check("itemPrice").not().isEmpty().withMessage("Please enter the unit price of the product"),
    check("itemQuantity").not().isEmpty().withMessage("Please enter the current quantity of the product"),
    check("itemColors").not().isEmpty().withMessage("Please insert colors, use comma differetiate"),
    check("itemCategory").not().isEmpty().withMessage("Insert Item Category"),
    check("mainImage").not().isEmpty().withMessage("Insert main image urls"),
  ],
  async (req, res) => {
    // Checking with the required // checking errors
    const errors = validationResult(req);
    // Check if errors
    if (!errors.isEmpty()) {
      return res.status("400").json({ errors: errors.array() });
    }

    try {
      // Extract the required variables for the product
      const { status, itemDescription, itemPrice, itemQuantity, itemName, itemBrand, itemColors, itemCategory, mainImage, descriptionImages } = req.body;

      // Build product object
      const productFields = {
        status: "",
        itemDescription: "",
        itemPrice: "",
        itemQuantity: "",
        itemName: "",
        itemColors: [],
        itemCategory: {},
        itemImages: {
          mainImage: "",
          descriptionImages: [],
        },
      };

      // Build newColors Array
      // new color field
      let newColors = itemColors.split(",").map((color) => color.trim());

      // // making image field
      // //  new image url fields
      // let desImages = descriptionImages ? descriptionImages.split(",").map((image) => image.trim()) : null;

      // Setting the product fields
      status && (productFields.status = status);
      itemDescription && (productFields.itemDescription = itemDescription);
      itemPrice && (productFields.itemPrice = itemPrice);
      itemQuantity && (productFields.itemQuantity = itemQuantity);
      itemName && (productFields.itemName = itemName);
      itemBrand && (productFields.itemBrand = itemBrand);
      newColors && (productFields.itemColors = newColors);
      itemCategory && (productFields.itemCategory = itemCategory);
      mainImage && (productFields.itemImages.mainImage = mainImage);
      descriptionImages && (productFields.itemImages.descriptionImages = descriptionImages);

      // for new product, we create
      const product = new Product(productFields);
      await product.save();
      // const products = await Product.find();
      res.json(product);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route  PUT api/product/:product_id
// @desc   Update a product
// @access Private
router.put(
  "/:product_id",
  adminAuth,
  [
    check("status").not().isEmpty().withMessage("Please enter the status of the product"),
    check("itemName").not().isEmpty().withMessage("Please enter the name of the product"),
    check("itemDescription").not().isEmpty().withMessage("Please enter the description of the product"),
    check("itemPrice").not().isEmpty().withMessage("Please enter the unit price of the product"),
    check("itemQuantity").not().isEmpty().withMessage("Please enter the current quantity of the product"),
    check("itemColors").not().isEmpty().withMessage("Please insert colors, use comma differetiate"),
    check("itemCategory").not().isEmpty().withMessage("Insert Item Category"),
    check("mainImage").not().isEmpty().withMessage("Insert main image urls"),
  ],
  async (req, res) => {
    // Checking with the required // checking errors
    const errors = validationResult(req);
    // Check if errors
    if (!errors.isEmpty()) {
      return res.status("400").json({ errors: errors.array() });
    }

    try {
      // Extract the required variables for the product
      const { status, itemDescription, itemPrice, itemQuantity, itemName, itemBrand, itemColors, itemCategory, mainImage, descriptionImages } = req.body;

      // Build product object
      const productFields = {
        status: "",
        itemDescription: "",
        itemPrice: "",
        itemQuantity: "",
        itemName: "",
        itemColors: [],
        itemCategory: {},
        itemImages: {
          mainImage: "",
          descriptionImages: [],
        },
      };

      // Build newColors Array
      // new color field
      let newColors = [];
      itemColors && typeof itemColors === "object" ? (newColors = itemColors) : (newColors = itemColors.split(",").map((color) => color.trim()));

      // // making image field
      // //  new image url fields
      // let desImages = [];
      // descriptionImages && typeof descriptionImages === "object"
      //   ? (desImages = descriptionImages)
      //   : (desImages = descriptionImages.split(",").map((image) => image.trim()));

      // Setting the product fields
      status && (productFields.status = status);
      itemDescription && (productFields.itemDescription = itemDescription);
      itemPrice && (productFields.itemPrice = itemPrice);
      itemQuantity && (productFields.itemQuantity = itemQuantity);
      itemName && (productFields.itemName = itemName);
      itemBrand && (productFields.itemBrand = itemBrand);
      newColors && (productFields.itemColors = newColors);
      itemCategory && (productFields.itemCategory = itemCategory);
      mainImage && (productFields.itemImages.mainImage = mainImage);
      descriptionImages && (productFields.itemImages.descriptionImages = descriptionImages);

      // for new product, we create
      const product = await Product.findOneAndUpdate({ _id: req.params.product_id }, { $set: productFields }, { new: true, upsert: true });
      await product.save();
      res.json(product);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route  PUT api/product/post/like
// @desc   Like a product
// @access Private
router.put("/post/like/:prd_id", auth, async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.prd_id });
    let liked = product.likes && product.likes.length > 0 ? product.likes.filter((prd) => prd.user === req.user.id)[0] : false;
    if (liked) {
      const index = product.likes.indexOf(liked);
      product.likes.splice(index, 1);
      await product.save();
      return res.json("Like Removed");
    }
    const user = await User.findById(req.user.id).select("-password");
    user &&
      (liked = {
        user: req.user.id,
        name: user.name,
      });
    product.likes && product.likes.push(liked);
    await product.save();
    res.json("You Liked This Product!");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// @route  PUT api/product/post/comment
// @desc   Post comment
// @access Private
router.put("/post/comment/:prd_id", [check("description").not().isEmpty().withMessage("description is required")], auth, async (req, res) => {
  // Checking with the required // checking errors
  const errors = validationResult(req);
  // Check if errors
  if (!errors.isEmpty()) {
    return res.status("400").json({ errors: errors.array() });
  }

  try {
    const product = await Product.findOne({ _id: req.params.prd_id });
    let comment = {};
    comment = {
      user: req.user.id,
      description: req.body.description,
      postedOn: new Date(),
    };
    product.comments && product.comments.unshift(comment);
    await product.save();
    res.json("Comment Posted");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// @route  DELETE api/product/post/comment
// @desc   Delete a comment
// @access Private
router.delete("/post/comment/:prd_id/:comment_id", auth, async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.prd_id });
    // console.log(req.params);
    // const userExist = product.comments ? product.comments.filter((comment) => comment.user === req.user.id) : false;
    // console.log(userExist);
    const isExist = product.comments ? product.comments.filter((comment) => comment._id.toString() === req.params.comment_id)[0] : false;
    if (req.user.id === isExist.user) {
      const index = product.comments.indexOf(isExist);
      product.comments.splice(index, 1);
      await product.save();
      return res.json("Your Comment Deleted");
    }
    res.json("Something went wrong!");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// @route  DELETE api/product/:product_id
// @desc   Delete a product
// @access Private
router.delete("/:product_id", adminAuth, async (req, res) => {
  try {
    // removing a product
    await Product.findOneAndRemove({ _id: req.params.product_id });
    res.json({ msg: "Product deleted successfully" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

export default router;
