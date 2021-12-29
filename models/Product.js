import mongoose from "mongoose";
const { Schema, model } = mongoose;

const ProductSchema = Schema({
  status: {
    type: String,
    required: true,
  },
  itemName: {
    type: String,
    required: true,
  },
  itemBrand: {
    type: String,
    default: "Unknown",
  },
  itemDescription: {
    type: String,
    required: true,
  },
  itemQuantity: {
    type: Number,
    required: true,
  },
  itemPrice: {
    type: Number,
    required: true,
  },
  itemPostedOn: {
    type: Date,
    default: Date.now,
  },
  itemColors: [],
  itemCategory: {
    type: String,
    required: true,
  },
  itemImages: {
    mainImage: { type: String, required: true },
    descriptionImages: [],
  },
  likes: [
    {
      user: { type: String, required: true },
      name: { type: String, required: true },
    },
  ],
  comments: [
    {
      user: { type: String, required: true },
      description: { type: String, required: true },
      postedOn: {
        type: String,
      },
    },
  ],
});

ProductSchema.set("toObject", {
  transform: function (doc, ret) {
    delete ret.__v;
  },
});

export default model("products", ProductSchema);
