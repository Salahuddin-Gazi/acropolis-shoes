import express from "express";
import Test from "../../models/Test.js";
import Product from "../../models/Product.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const products = await Product.find();
    // console.log(products);
    const resData = new Test();
    products.map((product) => resData.push(product));
    await resData.save();
    res.json(resData);
  } catch (err) {
    console.log(err);
    res.send("err");
  }
});

router.put("/:prd_id", async (req, res) => {
  try {
    const resData = await Test.find();
    // console.log(resData.products);
    // const updateData = "Pike";
    // const id = resData.products.find((product) => product._id === req.params.prd_id)._id;
    // resData.products.findOneAndUpdate({ _id: id }, { $set: { itemBrand: updateData } }, { new: true });
    // await resData.save();
    res.json(resData);
  } catch (err) {
    console.log(err);
    res.send("err");
  }
});

export default router;

p = [
  { id: 1, a: "Sohel" },
  { id: 5, a: "Taj" },
  { id: 7, a: "Naim" },
];

const isExist = p.filter((val) => val.id === 5)[0];
if (isExist) {
  const index = p.indexOf(isExist);
  p.splice(index, 1);
  return p;
}
