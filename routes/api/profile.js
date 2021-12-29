// import express from "express";
import Router from "express-promise-router";
import Profile from "../../models/Profile.js";
import User from "../../models/User.js";
import auth from "../../middleware/auth.js";
import { check, validationResult } from "express-validator";

// const router = express.Router();
const router = Router();

// @route  GET api/profile/profiles
// @desc   Create or update user profile
// @access Public
router.get("/profiles", async (req, res) => {
  try {
    let profiles = await Profile.find().select("user name avatar -_id");
    if (profiles) {
      return res.json(profiles);
    }
    res.status(500).send("Server Error");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route  GET api/profile
// @desc   Create or update user profile
// @access Private
router.get("/", auth, async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user.id });
    if (profile) {
      return res.json(profile);
    }
    res.json("Profile does not exist, please add one");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route  POST api/profile
// @desc   Create or update user profile
// @access Private
router.post("/", auth, async (req, res) => {
  try {
    // check for an existing profile
    let profile = await Profile.findOne({ user: req.user.id });
    let user = await Profile.findOne({ _id: req.user.id });
    if (profile) {
      return res.json("profile already exist");
    }

    // for new profile, we create
    let profileFields = {};
    profileFields.user = req.user.id;
    profileFields.name = user.name;
    profile = new Profile(profileFields);
    await profile.save();
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// @route  Delete api/profile
// @desc   Delete user & profile
// @access Private
router.delete("/", auth, async (req, res) => {
  try {
    // Removing Profile
    await Profile.findOneAndRemove({ user: req.user.id });
    // Removing the user
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: "Account & profile deleted successfully" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

//  @route  PUT api/profile/address
//  @desc   add address to profile
//  @access Private
router.put(
  "/address",
  auth,
  [
    check("city").not().isEmpty().withMessage("Please add a valid city to purachse"),
    check("address").not().isEmpty().withMessage("Please add a valid address to purachse"),
    check("phone").not().isEmpty().withMessage("Please add a phone number to purachse"),
  ],
  async (req, res) => {
    // Checking with req // validating the inputs
    const errors = validationResult(req);
    // checking for errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Destructuring data from req
      const { _id, region, city, area, address, description, phone } = req.body;

      // Making the new Experience object
      const newAddress = { _id: "", region: "", city: "", area: "", address: "", description: "", phone: "" };
      region && (newAddress.region = region);
      city && (newAddress.city = city);
      area && (newAddress.area = area);
      address && (newAddress.address = address);
      description && (newAddress.description = description);
      phone && (newAddress.phone = phone);
      _id && (newAddress._id = _id);

      const profile = await Profile.findOne({ user: req.user.id });
      profile.addressBook.splice(2);
      profile.addressBook.unshift(newAddress);
      await profile.save();
      res.json(newAddress);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

//  @route  DELETE api/profile/address/:add_id
//  @desc   delete address from profile
//  @access Private
router.delete("/address/:add_id", auth, async (req, res) => {
  try {
    // Find the profile
    const profile = await Profile.findOne({ user: req.user.id });
    // find the remove index
    const removeIndex = profile.addressBook.map((item) => item.id).indexOf(req.params.add_id);
    // remove the address
    profile.addressBook.splice(removeIndex, 1);
    // save the profile
    await profile.save();
    res.json("Your address deleted!");
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

//  @route  DELETE api/profile/orders/:order_id
//  @desc   delete address from profile
//  @access Private
router.delete("/orders/:order_id", auth, async (req, res) => {
  try {
    // Find the profile
    const profile = await Profile.findOne({ user: req.user.id });
    // find the remove index
    const removeIndex = profile.orders.map((item) => item.id).indexOf(req.params.order_id);
    // remove the address
    profile.orders.splice(removeIndex, 1);
    // save the profile
    await profile.save();
    res.json("Your order deleted!");
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

//  @route  PUT api/profile/orders
//  @desc   add order to profile
//  @access Private
router.put(
  "/orders",
  auth,
  [
    check("products").not().isEmpty().withMessage("No product to place order"),
    check("selectedPickup").not().isEmpty().withMessage("Please select a pickup"),
    check("selectedContact").not().isEmpty().withMessage("Please select a contact info"),
    check("selectedPayment").not().isEmpty().withMessage("Please select a payment info"),
    check("totalCost").not().isEmpty().withMessage("Insert total cost"),
  ],
  async (req, res) => {
    // Checking with req // validating the inputs
    const errors = validationResult(req);
    // checking for errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Destructuring data from req
      const { _id, products, selectedPickup, selectedContact, selectedPayment, totalCost } = req.body;

      // Making the new Order object
      const newOrder = { _id: "", products: [], selectedPickup: "", selectedContact: "", selectedPayment: "", totalCost: "", orderPlacedOn: new Date() };

      products && (newOrder.products = products);
      selectedPickup && (newOrder.selectedPickup = selectedPickup);
      selectedContact && (newOrder.selectedContact = selectedContact);
      selectedPayment && (newOrder.selectedPayment = selectedPayment);
      totalCost && (newOrder.totalCost = totalCost);
      _id && (newOrder._id = _id);

      const profile = await Profile.findOne({ user: req.user.id });
      // profile.orders.splice(4);
      profile.orders.unshift(newOrder);
      await profile.save();
      res.json(newOrder);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

//  @route  PUT api/profile/payments
//  @desc   add payment to profile
//  @access Private
router.put(
  "/payments",
  auth,
  [
    check("visa").not().isEmpty().withMessage("Please add a valid card number"),
    check("expires").not().isEmpty().withMessage("Add expiry date"),
    check("ccv").not().isEmpty().withMessage("Enter the ccv number"),
    check("cardHolderName").not().isEmpty().withMessage("Enter the card holder name"),
  ],
  async (req, res) => {
    // Checking with req // validating the inputs
    const errors = validationResult(req);
    // checking for errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Destructuring data from req
      const { _id, visa, expires, ccv, cardHolderName } = req.body;

      // Making the new Order object
      const newPayment = { _id: "", visa: "", expires: "", ccv: "" };

      visa && (newPayment.visa = visa);
      expires && (newPayment.expires = expires);
      ccv && (newPayment.ccv = ccv);
      _id && (newPayment._id = _id);
      cardHolderName && (newPayment.cardHolderName = cardHolderName);

      const profile = await Profile.findOne({ user: req.user.id });
      profile.payments.splice(2);
      profile.payments.unshift(newPayment);
      await profile.save();
      res.json(newPayment);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

//  @route  DELETE api/profile/payments/:payment_id
//  @desc   delete payment from profile
//  @access Private
router.delete("/payments/:payment_id", auth, async (req, res) => {
  try {
    // Find the profile
    const profile = await Profile.findOne({ user: req.user.id });
    // find the remove index
    const removeIndex = profile.payments.map((item) => item.id).indexOf(req.params.payment_id);
    // remove the address
    profile.payments.splice(removeIndex, 1);
    // save the profile
    await profile.save();
    res.json("Your payment methode deleted!");
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

//@route   PUT api/profile/avatar
//desc   Update profile avatar
//access private
router.put("/avatar", check("avatar").not().isEmpty().withMessage("Provide image file"), auth, async (req, res) => {
  // Checking with req // validating the inputs
  const errors = validationResult(req);
  // checking for errors
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const { avatar } = req.body;
    if (profile) {
      profile.avatar = avatar;
      await profile.save();
      return res.json(avatar);
    }
    res.json("User not found!");
  } catch (err) {
    console.log(err.message);
    res.status(500).json("Server Error");
  }
});

export default router;
